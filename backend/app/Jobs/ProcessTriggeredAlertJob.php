<?php

namespace App\Jobs;

use App\Events\AlertTriggered;
use App\Models\PriceAlert;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class ProcessTriggeredAlertJob
{
    use Dispatchable, SerializesModels;

    public $alertId;
    public $triggeredAtPrice;

    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct(int $alertId, float $triggeredAtPrice)
    {
        $this->alertId = $alertId;
        $this->triggeredAtPrice = $triggeredAtPrice;
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        $alert = PriceAlert::find($this->alertId);

        if (!$alert) {
            return;
        }

        // Idempotency check: if already triggered, do not broadcast/update again
        if ($alert->is_triggered) {
            return;
        }

        // 1. Update DB (Persistent Storage)
        $alert->update([
            'is_triggered' => true,
            'triggered_at' => now(),
        ]);

        // 2. Broadcast via Pusher (Real-time update)
        event(new AlertTriggered(
            userId:           $alert->user_id,
            symbol:           $alert->symbol,
            targetPrice:      (float)$alert->target_price,
            condition:        $alert->condition,
            triggeredAtPrice: $this->triggeredAtPrice,
            alertId:          $alert->id,
        ));
    }
}
