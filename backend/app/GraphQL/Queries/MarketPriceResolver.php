<?php

namespace App\GraphQL\Queries;
use App\Services\CryptoPriceService;

use Illuminate\Support\Facades\Redis;

class MarketPriceResolver
{
    public function __invoke($_, array $args)
    {
        $results = [];
        foreach ($args['symbols'] as $symbol) {
            $data=CryptoPriceService::getPriceData($symbol);
            $upperSymbol = strtoupper($symbol);
            
            // Nếu bạn truyền "BTC", nó sẽ tìm key "price:BTCUSDT"
            $fullSymbol = str_contains($upperSymbol, 'USDT') ? $upperSymbol : $upperSymbol . 'USDT';

            $results[] = [
                'symbol' => $upperSymbol,
                'price' => (float) Redis::get("price:{$fullSymbol}"),
                'change_24h' => (float) Redis::get("change:{$fullSymbol}"),
            ];
        }
        return $results;
    }
}