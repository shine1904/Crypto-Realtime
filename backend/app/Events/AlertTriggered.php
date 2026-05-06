<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class AlertTriggered implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(
        public int    $userId,
        public string $symbol,
        public float  $targetPrice,
        public string $condition,
        public float  $triggeredAtPrice,
        public int    $alertId,
    ) {}

    /**
     * Broadcast vào private channel của từng user để bảo mật.
     */
    public function broadcastOn(): \Illuminate\Broadcasting\PrivateChannel
    {
        return new \Illuminate\Broadcasting\PrivateChannel("user.{$this->userId}.alerts");
    }

    public function broadcastAs(): string
    {
        return 'alert.triggered';
    }

    public function broadcastWith(): array
    {
        return [
            'alert_id'           => $this->alertId,
            'symbol'             => $this->symbol,
            'target_price'       => $this->targetPrice,
            'condition'          => $this->condition,
            'triggered_at_price' => $this->triggeredAtPrice,
            'message'            => sprintf(
                '🔔 %s đã %s $%s (hiện tại: $%s)',
                $this->symbol,
                $this->condition === 'above' ? 'tăng vượt' : 'giảm xuống dưới',
                number_format($this->targetPrice, 2),
                number_format($this->triggeredAtPrice, 2),
            ),
        ];
    }
}
