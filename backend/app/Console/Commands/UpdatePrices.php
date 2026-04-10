<?php
namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Redis;
use function Ratchet\Client\connect;

class UpdatePrices extends Command
{
    protected $signature = 'crypto:update-prices';
    protected $description = 'Connect to Binance WebSocket and update Redis';

    public function handle()
    {
        $symbols = ['btcusdt', 'ethusdt', 'bnbusdt']; // Các cặp tiền muốn theo dõi
        $streams = implode('/', array_map(fn($s) => "{$s}@ticker", $symbols));
        $url = "wss://stream.binance.com:9443/ws/{$streams}";

        $this->info("Connecting to Binance WebSocket: {$url}");

        connect($url)->then(function($conn) {
            $conn->on('message', function($msg) {
                $data = json_decode($msg, true);
                $symbol = strtoupper($data['s']);
                $price = $data['c']; // Giá hiện tại (Close price)
                $percent = $data['P']; // % thay đổi 24h

                // Đẩy thẳng vào Redis
                Redis::set("price:{$symbol}", $price);
                Redis::set("change:{$symbol}", $percent);

                $this->info("Updated {$symbol}: {$price} ({$percent}%)");
            });
        }, function ($e) {
            $this->error("Could not connect: {$e->getMessage()}");
        });
    }
}