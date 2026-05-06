<?php

namespace App\Listeners;

use App\Events\PriceUpdated;
use App\Jobs\ProcessTriggeredAlertJob;
use Illuminate\Support\Facades\Redis;

class PriceAlertListener
{
    /**
     * Tên queue để xử lý bất đồng bộ, không block WebSocket worker.
     */
    public string $queue = 'alerts';

    /**
     * Lua Script to fetch and remove alerts atomically.
     */
    private string $luaScript = <<<'LUA'
        local alerts = redis.call('ZRANGEBYSCORE', KEYS[1], ARGV[1], ARGV[2])
        if #alerts > 0 then
            redis.call('ZREM', KEYS[1], unpack(alerts))
        end
        return alerts
LUA;

    /**
     * Handle mỗi khi BinancePriceWorker phát ra PriceUpdated event.
     */
    public function handle(PriceUpdated $event): void
    {
        $symbol = strtoupper($event->symbol);
        $price  = (float) $event->price;

        // Build key names (Predis will auto-prefix KEYS[n] in eval command)
        $aboveKey = "alerts:above:{$symbol}";
        $belowKey = "alerts:below:{$symbol}";

        // Use the raw Predis client to run eval
        $client = Redis::connection()->client();

        // Condition 'above': alerts where target_price <= current_price
        $aboveAlerts = $client->eval($this->luaScript, 1, $aboveKey, '-inf', (string)$price);
        
        // Condition 'below': alerts where target_price >= current_price
        $belowAlerts = $client->eval($this->luaScript, 1, $belowKey, (string)$price, '+inf');

        $triggeredAlertIds = array_merge((array)$aboveAlerts, (array)$belowAlerts);

        if (empty($triggeredAlertIds)) {
            return;
        }

        \Illuminate\Support\Facades\Log::info("[AlertListener] Triggered alerts for {$symbol} @ {$price}", [
            'above_key' => $aboveKey,
            'below_key' => $belowKey,
            'ids' => $triggeredAlertIds,
        ]);

        foreach ($triggeredAlertIds as $alertId) {
            // Dispatch single job that handles DB Update + Broadcast
            ProcessTriggeredAlertJob::dispatch((int)$alertId, $price);
        }
    }
}

