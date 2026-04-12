<?php
namespace App\Observers;

use App\Models\Wallet;
use Illuminate\Support\Facades\Redis;

class WalletObserver
{
    public function saved(Wallet $wallet)
    {
        Redis::sadd('sync:active_symbols', strtoupper($wallet->coin_symbol));
    }

public function deleted(Wallet $wallet)
{
    // Kiểm tra xem còn ai giữ đồng này không trước khi xóa khỏi danh sách theo dõi
    $exists = Wallet::where('coin_symbol', $wallet->coin_symbol)->exists();
    if (!$exists) {
        Redis::srem('sync:active_symbols', strtoupper($wallet->coin_symbol));
    }
}
}