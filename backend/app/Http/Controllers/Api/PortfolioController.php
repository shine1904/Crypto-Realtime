<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Wallet;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redis;

class PortfolioController extends Controller
{
    // Lấy danh sách coin trong ví của User
    public function index()
    {
        $wallets = Wallet::where('user_id', Auth::id())->get();
        return response()->json([
            'status' => 'success',
            'data' => $wallets
        ]);
    }

    // Thêm hoặc cập nhật coin
    public function store(Request $request)
    {
        $request->validate([
            'coin_symbol' => 'required|string|max:10',
            'amount' => 'required|numeric|min:0',
            'avg_buy_price' => 'nullable|numeric|min:0',
        ]);

        $wallet = Wallet::updateOrCreate(
            [
                'user_id' => Auth::id(),
                'coin_symbol' => strtoupper($request->coin_symbol),
            ],
            [
                'amount' => $request->amount,
                'avg_buy_price' => $request->avg_buy_price,
            ]
        );

        // Thêm symbol vào danh sách đang theo dõi trên Redis
        Redis::sadd('sync:active_symbols', strtoupper($request->coin_symbol));

        return response()->json([
            'message' => 'Portfolio updated successfully',
            'data' => $wallet
        ]);
    }

    // Xóa coin khỏi danh mục theo dõi
    public function destroy($symbol)
    {
        $symbol = strtoupper($symbol);
        $deleted = Wallet::where('user_id', Auth::id())
                        ->where('coin_symbol', $symbol)
                        ->delete();

        // Kiểm tra xem còn ai giữ coin này không
        if (Wallet::where('coin_symbol', $symbol)->count() === 0) {
            Redis::srem('sync:active_symbols', $symbol);
        }

        return response()->json(['message' => $deleted ? 'Deleted' : 'Not found']);
    }
}