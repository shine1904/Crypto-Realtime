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
    protected $description = 'Worker lấy giá real-time từ Binance (WebSocket)';

    protected $currentSymbols = [];
    protected $lastPublished = [];
    protected $lastMessageTime = 0;
    protected $syncTimer = null;

    public function handle()
    {
        $this->info("Worker start...");

        $loop = Loop::get();
        $connector = new Connector($loop);

        $this->connect($connector, $loop);

        $loop->run();
    }

    protected function connect($connector, $loop)
    {
        $this->lastMessageTime = microtime(true);

        $connector('wss://stream.binance.com:9443/ws')->then(
            function (WebSocket $conn) use ($connector, $loop) {

                $this->info("Connected Binance");

                // WATCHDOG: kill nếu không có data
                $watchdog = $loop->addPeriodicTimer(30, function () use ($conn) {
                    $diff = microtime(true) - $this->lastMessageTime;

                    if ($diff > 60) {
                        $this->error("No data {$diff}s -> force reconnect");
                        $conn->close();
                    }
                });

                // SYNC SYMBOL
                if ($this->syncTimer) {
                    $loop->cancelTimer($this->syncTimer);
                }

                $this->syncTimer = $loop->addPeriodicTimer(5, function () use ($conn) {
                    try {
                        $raw = Redis::smembers('sync:active_symbols');
                        if (!is_array($raw)) $raw = [];

                        // DB Fallback: Nếu Redis trống, seed từ Holdings (user-added coins)
                        if (empty($raw)) {
                            $dbSymbols = \App\Models\Holding::where('amount', '>', 0)->distinct()->pluck('coin_symbol')->toArray();
                            if (!empty($dbSymbols)) {
                                $this->info("Seeding Redis from DB...");
                                foreach ($dbSymbols as $ds) {
                                    Redis::sadd('sync:active_symbols', strtoupper($ds));
                                }
                                $raw = $dbSymbols;
                            }
                        }

                        // Gộp với Market Baseline (Top 100)
                        $baseline = $this->getMarketBaselineSymbols();
                        $merged = array_unique(array_merge($raw, $baseline));

                        $symbols = [];
                        foreach ($merged as $s) {
                            $pair = strtolower($s) . 'usdt';
                            $symbols[$pair] = strtoupper($s);
                        }

                        // SAFE GUARD: luôn có ít nhất 1 stream
                        if (empty($symbols)) {
                            $symbols = ['btcusdt' => 'BTC'];
                        }

                        $newPairs = array_keys($symbols);
                        sort($newPairs);

                        $currentPairs = array_keys($this->currentSymbols);
                        sort($currentPairs);

                        if ($newPairs !== $currentPairs) {
                            $this->info("Update stream...");

                            // UNSUBSCRIBE cũ
                            if (!empty($currentPairs)) {
                                $params = array_map(fn($p) => $p . '@ticker', $currentPairs);
                                $conn->send(json_encode([
                                    'method' => 'UNSUBSCRIBE',
                                    'params' => $params,
                                    'id' => 1
                                ]));

                                // clear memory
                                foreach ($this->currentSymbols as $sym) {
                                    unset($this->lastPublished[$sym]);
                                }
                            }

                            // SUBSCRIBE mới
                            $params = array_map(fn($p) => $p . '@ticker', $newPairs);
                            $this->info("Subscribe: " . implode(',', $params));

                            $conn->send(json_encode([
                                'method' => 'SUBSCRIBE',
                                'params' => $params,
                                'id' => 2
                            ]));

                            $this->currentSymbols = $symbols;
                        }
                    } catch (\Exception $e) {
                        if ($this->output) {
                            $this->error("Redis sync error: " . $e->getMessage());
                        }
                    }
                });

                // MESSAGE
                $conn->on('message', function ($msg) use ($conn) {

                    $this->lastMessageTime = microtime(true);

                    $data = json_decode($msg, true);

                    // SUBSCRIBE RESPONSE
                    if (isset($data['result'])) {
                        $this->info("Subscribe OK");
                        return;
                    }

                    // ERROR
                    if (isset($data['code'])) {
                        $this->error("Binance error: " . json_encode($data));
                        return;
                    }

                    // DATA
                    if (isset($data['e']) && $data['e'] === '24hrTicker') {

                        $pair = strtolower($data['s']);

                        if (!isset($this->currentSymbols[$pair])) {
                            return;
                        }

                        $symbol = $this->currentSymbols[$pair];
                        $price = (float)$data['c'];
                        $change = (float)$data['P'];

                        // Redis: Dùng format mới thống nhất
                        try {
                            Redis::set("crypto:price:{$symbol}", $price);
                            Redis::set("crypto:change:{$symbol}", $change);
                        } catch (\Exception $e) {
                            if ($this->output) {
                                $this->error("Redis write error: " . $e->getMessage());
                            }
                        }

                        // throttle event
                        $now = microtime(true);
                        if (
                            !isset($this->lastPublished[$symbol]) ||
                            ($now - $this->lastPublished[$symbol]) > 0.5
                        ) {
                            $this->lastPublished[$symbol] = $now;
                            event(new PriceUpdated($symbol, $price, $change));
                        }
                    }
                });

                // CLOSE
                $conn->on('close', function ($code = null, $reason = null) use ($connector, $loop, $watchdog) {

                    $this->error("Closed: {$code} {$reason}");

                    $loop->cancelTimer($watchdog);
                    if ($this->syncTimer) {
                        $loop->cancelTimer($this->syncTimer);
                        $this->syncTimer = null;
                    }

                    $this->currentSymbols = [];

                    $loop->addTimer(3, function () use ($connector, $loop) {
                        $this->connect($connector, $loop);
                    });
                });
            },

            function (\Exception $e) use ($connector, $loop) {

                $this->error("Connect error: " . $e->getMessage());

                $loop->addTimer(3, function () use ($connector, $loop) {
                    $this->connect($connector, $loop);
                });
            }
        );
    }

    protected function getMarketBaselineSymbols()
    {
        return [
            'BTC', 'ETH', 'BNB', 'SOL', 'XRP', 'ADA', 'DOGE', 'AVAX', 'SHIB', 'DOT',
            'LINK', 'TRX', 'MATIC', 'LTC', 'NEAR', 'UNI', 'DAI', 'ATOM', 'XLM', 'OP',
            'KAS', 'ARB', 'ICP', 'ETC', 'APT', 'BCH', 'FIL', 'LDO', 'HBAR', 'RNDR',
            'VET', 'TIA', 'STX', 'IMX', 'CRO', 'GRT', 'INJ', 'MKR', 'SEI', 'THETA',
            'ROSE', 'ALGO', 'EGLD', 'FLOW', 'SAND', 'MANA', 'AAVE', 'BSV', 'AXS', 'CHZ',
            'SNX', 'NEO', 'GALA', 'EOS', 'QNT', 'KSM', 'KLAY', 'IOTA', 'MINA', 'CRV',
            'CFX', 'DASH', 'RUNE', 'KAVA', 'GMX', 'DYDX', 'AGIX', 'OCEAN', 'FET', 'ENS',
            'PENDLE', 'JUP', 'BEAM', 'PYTH', 'RON', 'MAVIA', 'PYR', 'BIGTIME', 'PORTAL', 'WIF',
            'PEPE', 'BONK', 'FLOKI', 'ORDI', 'SATS', '1000SATS', 'STG', 'ZETA', 'DYM', 'MANTA',
            'ALT', 'PIXEL', 'STRK', 'GLMR', 'ASTR', 'MOVR', 'METIS', 'ZIL', 'LRC', 'ENJ'
        ];
    }
}