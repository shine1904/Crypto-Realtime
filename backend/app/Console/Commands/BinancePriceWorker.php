<?php
namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Events\PriceUpdated;
use Illuminate\Support\Facades\Redis;
use Ratchet\Client\WebSocket;
use Ratchet\Client\Connector;
use React\EventLoop\Loop;

class BinancePriceWorker extends Command
{
    protected $signature = 'binance:price-worker';
    protected $description = 'Worker lấy giá real-time từ Binance (WebSocket) và đẩy vào hệ thống';

    protected $currentSymbols = [];
    protected $lastPublished = [];

    public function handle()
    {
        $this->info("Worker đang khởi động (WebSocket Mode)...");

        $loop = Loop::get();
        $reactConnector = new \React\Socket\Connector(['timeout' => 15]);
        $connector = new Connector($loop, $reactConnector);

        $this->connectToBinance($connector, $loop);

        $loop->run();
    }

    protected function connectToBinance(Connector $connector, $loop)
    {
        $connector('wss://stream.binance.com:9443/ws')->then(function(WebSocket $conn) use ($connector, $loop) {
            $this->info("Đã kết nối với Binance WebSocket!");

            // Hàng đợi kiểm tra symbols định kỳ (mỗi 3 giây)
            $loop->addPeriodicTimer(3.0, function () use ($conn) {
                // Lấy symbols đang theo dõi
                $rawSymbols = Redis::smembers('sync:active_symbols');
                $symbols = [];
                // Binance WS yêu cầu symbol in thường
                foreach ($rawSymbols as $s) {
                    // Cặp giao dịch thông thường có đuôi USDT, nếu người dùng thêm "BTC", ta tự động append "USDT".
                    // Code cũ (BinanceService) tự động lấy USDT.
                    // Tùy theo cách user lưu symbol: Nếu lưu "BTC", "ETH" -> thêm USDT.
                    $pair = strtolower($s) . 'usdt';
                    $symbols[$pair] = strtoupper($s);
                }

                $newPairs = array_keys($symbols);
                sort($newPairs);
                
                $currentPairs = array_keys($this->currentSymbols);
                sort($currentPairs);

                if ($newPairs !== $currentPairs) {
                    // Update current symbols
                    $this->currentSymbols = $symbols;

                    // Unsubscribe all cũ
                    if (!empty($currentPairs)) {
                        $unsubParams = array_map(function($p) { return $p . '@ticker'; }, $currentPairs);
                        $conn->send(json_encode([
                            'method' => 'UNSUBSCRIBE',
                            'params' => $unsubParams,
                            'id' => 1
                        ]));
                    }

                    // Subscribe mới
                    if (!empty($newPairs)) {
                        $subParams = array_map(function($p) { return $p . '@ticker'; }, $newPairs);
                        $this->info("Subscribing: " . implode(', ', $subParams));
                        $conn->send(json_encode([
                            'method' => 'SUBSCRIBE',
                            'params' => $subParams,
                            'id' => 2
                        ]));
                    } else {
                        $this->info("Không có coin nào trong danh mục theo dõi.");
                    }
                }
            });

            $conn->on('message', function($msg) {
                $data = json_decode($msg, true);
                if (isset($data['e']) && $data['e'] === '24hrTicker') {
                    $pair = strtolower($data['s']);
                    if (isset($this->currentSymbols[$pair])) {
                        $symbol = $this->currentSymbols[$pair];
                        $price = (float)$data['c'];
                        $changePercent = (float)$data['P'];

                        // Throttling: Cập nhật cache luôn, nhưng chỉ Publish Event cho Subscription max 2 lần/giây.
                        Redis::set("prices:{$symbol}", $price);

                        $now = microtime(true);
                        if (!isset($this->lastPublished[$symbol]) || ($now - $this->lastPublished[$symbol]) > 0.5) {
                            $this->lastPublished[$symbol] = $now;
                            
                            // Publish Event (Lighthouse / Broadcasting sẽ sử dụng)
                            event(new PriceUpdated($symbol, $price, $changePercent));
                            
                            $this->line("Published UI update: {$symbol} - {$price}");
                        }
                    }
                }
            });

            $conn->on('close', function($code = null, $reason = null) use ($connector, $loop) {
                $this->error("WebSocket đóng kết nối: ({$code}) {$reason}. Đang thử kết nối lại...");
                $this->currentSymbols = []; // Reset để nó subscribe lại khi connect
                $loop->addTimer(2.0, function() use ($connector, $loop) {
                    $this->connectToBinance($connector, $loop);
                });
            });

        }, function(\Exception $e) use ($connector, $loop) {
            $this->error("Không thể kết nối WS: {$e->getMessage()}");
            $loop->addTimer(2.0, function() use ($connector, $loop) {
                $this->connectToBinance($connector, $loop);
            });
        });
    }
}