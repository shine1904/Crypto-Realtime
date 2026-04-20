<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Coin;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redis;

class CoinController extends Controller
{
    /**
     * Lấy danh sách coin active kèm giá live từ Redis (dùng mget để tối ưu)
     */
    public function index()
    {
        // Lấy danh sách coin active từ DB
        $coins = Coin::active()->orderBy('sort_order')->get();

        if ($coins->isEmpty()) {
            return response()->json([]);
        }

        // Xây dựng tất cả key cần lấy một lượt (mget = O(N) 1 round-trip thay vì N round-trips)
        $priceKeys  = $coins->map(fn($c) => "crypto:price:{$c->symbol}")->toArray();
        $changeKeys = $coins->map(fn($c) => "crypto:change:{$c->symbol}")->toArray();

        // 1 call lấy tất cả prices, 1 call lấy tất cả changes
        $prices  = Redis::mget($priceKeys);
        $changes = Redis::mget($changeKeys);

        $data = $coins->values()->map(function ($coin, $i) use ($prices, $changes) {
            return [
                'id'        => $coin->id,
                'symbol'    => $coin->symbol,
                'name'      => $coin->name,
                'icon_url'  => $coin->icon_url,
                'price'     => (float) ($prices[$i] ?? 0),
                'change24h' => (float) ($changes[$i] ?? 0),
            ];
        });

        return response()->json($data);
    }

    /**
     * Lấy thông tin chi tiết + giá live của 1 coin theo symbol
     */
    public function show(string $symbol)
    {
        $symbol = strtoupper($symbol);

        $coin = Coin::where('symbol', $symbol)->first();

        // Lấy price + change từ Redis
        $redis  = Redis::mget(["crypto:price:{$symbol}", "crypto:change:{$symbol}"]);
        $price  = (float) ($redis[0] ?? 0);
        $change = (float) ($redis[1] ?? 0);

        // Nếu không có trong DB coin table, vẫn trả về data từ Redis
        if (!$coin) {
            return response()->json([
                'symbol'    => $symbol,
                'name'      => $symbol,
                'icon_url'  => null,
                'price'     => $price,
                'change24h' => $change,
            ]);
        }

        return response()->json([
            'id'        => $coin->id,
            'symbol'    => $coin->symbol,
            'name'      => $coin->name,
            'icon_url'  => $coin->icon_url,
            'price'     => $price,
            'change24h' => $change,
        ]);
    }
}