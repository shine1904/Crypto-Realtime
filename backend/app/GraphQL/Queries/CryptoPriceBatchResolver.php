<?php
namespace App\GraphQL\Queries;

use Illuminate\Support\Facades\Redis;

class CryptoPriceBatchResolver
{
    /**
     * @param  null  $_
     * @param  array{symbols: string[]}  $args
     */
    public function __invoke($_, array $args)
    {
        $symbols = $args['symbols']; // Mảng symbols truyền từ FE: ["BTCUSDT", "ETHUSDT"...]
        
        $results = [];

        foreach ($symbols as $symbol) {
            $symbol = strtoupper($symbol);
            
            // Lấy dữ liệu từ Redis mà Worker của bạn đã đổ vào trước đó
            $priceKeys = ['price:BTCUSDT', 'price:ETHUSDT'];
            $changeKeys = ['change:BTCUSDT', 'change:ETHUSDT'];

            // Gom tất cả vào 1 mảng để lấy 1 lần
            $allKeys = array_merge($priceKeys, $changeKeys);
            $values = Redis::mget($allKeys);

            $results[] = [
                'symbol' => $symbol,
                'price' => $priceKeys ? (float) $priceKeys : 0,
                'change_24h' => $changeKeys ? (float) $changeKeys : 0,
            ];
        }

        return $results;
    }
}