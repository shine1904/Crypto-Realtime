<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class AlertTriggered implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(
        public readonly int    $userId,
        public readonly string $symbol,
        public readonly float  $targetPrice,
        public readonly string $condition,
        public readonly float  $triggeredAtPrice,
        public readonly int    $alertId,
    ) {}

    /**
     * Broadcast vào private channel của từng user để bảo mật.
     */
    public function broadcastOn(): Channel
    {
        return new Channel("user.{$this->userId}.alerts");
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
