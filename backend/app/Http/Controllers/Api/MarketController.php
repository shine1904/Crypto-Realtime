<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Coin;
use Illuminate\Support\Facades\Redis;

class MarketController extends Controller
{
    public function index()
    {
        // Lấy danh sách symbol từ coin table (đã seeded)
        $coins = Coin::active()->orderBy('sort_order')->pluck('symbol')->toArray();

        // Nếu DB trống, fallback: quét keys Redis như cũ
        if (empty($coins)) {
            return $this->fallbackFromRedisKeys();
        }

        // Xây dựng tất cả key cần lấy — mget 2 lần thay vì N*2 lần get
        $priceKeys  = array_map(fn($s) => "crypto:price:{$s}", $coins);
        $changeKeys = array_map(fn($s) => "crypto:change:{$s}", $coins);

        $prices  = Redis::mget($priceKeys);
        $changes = Redis::mget($changeKeys);

        $marketData = [];
        foreach ($coins as $i => $symbol) {
            $price = (float) ($prices[$i] ?? 0);
            // Bỏ qua symbol chưa có giá trong Redis (worker chưa subscribe)
            if ($price <= 0) continue;

            $marketData[] = [
                'symbol'    => $symbol,
                'price'     => $price,
                'change24h' => (float) ($changes[$i] ?? 0),
            ];
        }

        // Sắp xếp theo giá cao nhất
        usort($marketData, fn($a, $b) => $b['price'] <=> $a['price']);

        return response()->json($marketData);
    }

    /**
     * Fallback khi DB chưa có coin: quét Redis keys (chậm hơn nhưng an toàn)
     */
    private function fallbackFromRedisKeys(): \Illuminate\Http\JsonResponse
    {
        $prefix  = config('database.redis.options.prefix', '');
        $rawKeys = Redis::keys('crypto:price:*');
        $marketData = [];

        if (empty($rawKeys)) {
            return response()->json([]);
        }

        // Lấy danh sách symbol từ key pattern
        $symbols = [];
        foreach ($rawKeys as $rawKey) {
            $cleanKey = $prefix ? str_replace($prefix, '', $rawKey) : $rawKey;
            $symbol   = str_replace('crypto:price:', '', $cleanKey);
            if ($symbol) $symbols[] = strtoupper($symbol);
        }

        $priceKeys  = array_map(fn($s) => "crypto:price:{$s}", $symbols);
        $changeKeys = array_map(fn($s) => "crypto:change:{$s}", $symbols);
        $prices  = Redis::mget($priceKeys);
        $changes = Redis::mget($changeKeys);

        foreach ($symbols as $i => $symbol) {
            $marketData[] = [
                'symbol'    => $symbol,
                'price'     => (float) ($prices[$i] ?? 0),
                'change24h' => (float) ($changes[$i] ?? 0),
            ];
        }

        usort($marketData, fn($a, $b) => $b['price'] <=> $a['price']);

        return response()->json($marketData);
    }
}