<?php
namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class MarketUpdate implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $data;

    public function __construct($data)
    {
        $this->data = $data; // Mảng 100 coin hoặc 1 object update đơn lẻ
    }

    public function broadcastOn()
    {
        // Broadcast lên một channel chung cho tất cả mọi người
        return new Channel('market-prices');
    }

    public function broadcastAs()
    {
        return 'updated';
    }
}