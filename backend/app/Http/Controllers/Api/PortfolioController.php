<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Holding;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Redis;

class PortfolioController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'symbol' => 'required|string',
            'amount' => 'required|numeric|min:0.00000001',
            'price' => 'required|numeric|min:0',
            'type' => 'required|in:BUY,SELL',
        ]);

        return DB::transaction(function () use ($request) {
            $user = $request->user();
            $symbol = strtoupper($request->symbol);
            $amount = $request->amount;
            $price = $request->price;

            // 1. Lưu nhật ký giao dịch
            Transaction::create([
                'user_id' => $user->id,
                'coin_symbol' => $symbol,
                'type' => $request->type,
                'amount' => $amount,
                'price' => $price,
            ]);

            // 2. Cập nhật bảng Holdings (Số dư hiện tại)
            $holding = Holding::firstOrNew([
                'user_id' => $user->id,
                'coin_symbol' => $symbol
            ]);

            if ($request->type === 'BUY') {
                // Tính toán Giá vốn bình quân (DCA)
                $oldTotalCost = $holding->amount * $holding->average_buy_price;
                $newInvestment = $amount * $price;
                $newTotalAmount = $holding->amount + $amount;

                $holding->average_buy_price = ($oldTotalCost + $newInvestment) / $newTotalAmount;
                $holding->amount = $newTotalAmount;
            } else {
                // Nếu SELL: Kiểm tra số dư trước khi bán
                if ($holding->amount < $amount) {
                    throw new \Exception("Số dư không đủ để bán!");
                }
                $holding->amount -= $amount;
            }

            $holding->save();

            // 3. Quản lý Redis cho Worker (Chỉ sync khi còn tài sản)
            $this->manageRedisSync($symbol);

            return response()->json([
                'message' => 'Giao dịch thành công',
                'holding' => $holding
            ]);
        });
    }

    private function manageRedisSync($symbol)
    {
        // Kiểm tra xem trên toàn hệ thống còn ai giữ coin này không
        $isStillHeld = Holding::where('coin_symbol', $symbol)
                              ->where('amount', '>', 0)
                              ->exists();

        if ($isStillHeld) {
            // Thêm vào danh sách theo dõi của Worker
            Redis::sadd('sync:active_symbols', $symbol);
        } else {
            // Xóa khỏi Redis để tiết kiệm tài nguyên Worker nếu không còn ai giữ
            Redis::srem('sync:active_symbols', $symbol);
        }
    }
    /**
 * Lấy danh sách tài sản đang nắm giữ (Holdings) của User
 */
public function index(Request $request)
{
    // Lấy tất cả các đồng coin có số lượng > 0 của user hiện tại
    $holdings = Holding::where('user_id', $request->user()->id)
        ->where('amount', '>', 0)
        ->orderBy('amount', 'desc')
        ->get();

    return response()->json([
        'status' => 'success',
        'data' => $holdings
    ]);
}
}