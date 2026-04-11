<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Wallet;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

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

        return response()->json([
            'message' => 'Portfolio updated successfully',
            'data' => $wallet
        ]);
    }

    // Xóa coin khỏi danh mục theo dõi
    public function destroy($symbol)
    {
        $deleted = Wallet::where('user_id', Auth::id())
                        ->where('coin_symbol', strtoupper($symbol))
                        ->delete();

        return response()->json(['message' => $deleted ? 'Deleted' : 'Not found']);
    }
}