<?php

namespace App\Listeners;

use App\Events\AlertTriggered;
use App\Events\PriceUpdated;
use App\Models\PriceAlert;
use Illuminate\Contracts\Queue\ShouldQueue;

class PriceAlertListener implements ShouldQueue
{
    /**
     * Tên queue để xử lý bất đồng bộ, không block WebSocket worker.
     */
    public string $queue = 'alerts';

    /**
     * Handle mỗi khi BinancePriceWorker phát ra PriceUpdated event.
     */
    public function handle(PriceUpdated $event): void
    {
        $symbol = strtoupper($event->symbol);
        $price  = (float) $event->price;  // PriceUpdated::$price

        // Chỉ lấy các alert chưa triggered cho symbol này
        $alerts = PriceAlert::where('symbol', $symbol)
            ->where('is_triggered', false)
            ->get();

        if ($alerts->isEmpty()) {
            return;
        }

        foreach ($alerts as $alert) {
            $target    = (float) $alert->target_price;
            $triggered = false;

            if ($alert->condition === 'above' && $price >= $target) {
                $triggered = true;
            } elseif ($alert->condition === 'below' && $price <= $target) {
                $triggered = true;
            }

            if ($triggered) {
                // Cập nhật trạng thái
                $alert->update([
                    'is_triggered'  => true,
                    'triggered_at'  => now(),
                ]);

                // Gửi realtime notification về frontend qua Pusher
                event(new AlertTriggered(
                    userId:           $alert->user_id,
                    symbol:           $symbol,
                    targetPrice:      $target,
                    condition:        $alert->condition,
                    triggeredAtPrice: $price,
                    alertId:          $alert->id,
                ));
            }
        }
    }
}
