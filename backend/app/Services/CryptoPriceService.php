<?php
namespace App\Services;

use Illuminate\Support\Facades\Redis;

class CryptoPriceService
{
    // Hàm này dành cho các file cũ (lấy 1 đồng coin)
    public static function getPriceData(string $symbol)
    {
        $symbol = strtoupper($symbol);
        return [
            'price' => (float) Redis::get("price:{$symbol}"),
            'change' => (float) Redis::get("change:{$symbol}"),
        ];
    }

    // Hàm này dành cho Dashboard (dùng MGET để tối ưu)
    public static function getBatchPriceData(array $symbols)
    {
        $priceKeys = collect($symbols)->map(fn($s) => "price:".strtoupper($s))->toArray();
        $changeKeys = collect($symbols)->map(fn($s) => "change:".strtoupper($s))->toArray();

        // MGET lấy tất cả
        $allValues = Redis::mget(array_merge($priceKeys, $changeKeys));
        
        $count = count($symbols);
        $results = [];

        for ($i = 0; $i < $count; $i++) {
            $results[strtoupper($symbols[$i])] = [
                'price' => (float) ($allValues[$i] ?? 0),
                'change' => (float) ($allValues[$i + $count] ?? 0),
            ];
        }
        return $results;
    }
}