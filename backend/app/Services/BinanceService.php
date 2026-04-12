<?php
namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Redis;

class BinanceService
{
    protected $baseUrl = 'https://api.binance.com/api/v3';

    // 1. Call REST API để lấy dữ liệu tổng quan ban đầu
    public function getTickerPrice($symbol = 'BTCUSDT')
{
    $response = Http::get("{$this->baseUrl}/ticker/24hr", ['symbol' => $symbol]);
    
    if ($response->successful()) {
        $data = $response->json();
        $price = $data['lastPrice'];
        $change = $data['priceChangePercent'];

        // 1. Lưu vào Redis Cache (Cho các Query thông thường)
        Redis::set("price:{$symbol}", $price);
        Redis::set("change:{$symbol}", $change);

        // 2. Publish vào Redis Channel (Cho GraphQL Subscription)
        // Đây là lệnh giúp GraphQL "đẩy" data xuống FE ngay lập tức
        Redis::publish('coin_prices', json_encode([
            'symbol' => $symbol,
            'price'  => (float)$price,
            'change' => (float)$change,
            'updated_at' => now()->toDateTimeString()
        ]));

        return $data;
    }
    return null;
}
}