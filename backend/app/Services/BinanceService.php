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
            // Lưu vào Redis để Frontend lấy nhanh
            Redis::set("price:{$symbol}", $data['lastPrice']);
            Redis::set("change:{$symbol}", $data['priceChangePercent']);
            return $data;
        }
        return null;
    }
}