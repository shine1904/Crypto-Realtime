<?php
namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class PriceUpdated implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $symbol;
    public $price;
    public $change_24h;

    public function __construct($symbol, $price, $change_24h)
    {
        $this->symbol = $symbol;
        $this->price = (float) $price;
        $this->change_24h = (float) $change_24h;
    }

    public function broadcastOn()
    {
        // Phát trên một channel chung cho giá crypto
        return new Channel('crypto-prices');
    }

    public function broadcastAs()
    {
        return 'price.updated';
    }
}