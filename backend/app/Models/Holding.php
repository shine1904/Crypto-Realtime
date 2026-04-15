<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Holding extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'coin_symbol',
        'amount',
        'average_buy_price',
    ];

    protected $casts = [
        'amount' => 'decimal:8',
        'average_buy_price' => 'decimal:8',
    ];

    /**
     * Liên kết: Khoản nắm giữ này thuộc về một User
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Hàm hỗ trợ: Tính tổng vốn đã bỏ ra (Vốn gốc)
     */
    public function getTotalInvestedAttribute(): float
    {
        return (float) ($this->amount * $this->average_buy_price);
    }

    /**
     * Hàm hỗ trợ: Tính lợi nhuận thực tế dựa trên giá Live hiện tại
     * (Hàm này dùng ở Backend nếu cần tính toán trước khi trả về API)
     */
    public function calculateProfit($currentLivePrice): float
    {
        if ($this->amount <= 0) return 0;
        
        return (float) ($this->amount * ($currentLivePrice - $this->average_buy_price));
    }
}