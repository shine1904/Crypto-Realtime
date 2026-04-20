<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PriceAlert extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'symbol',
        'target_price',
        'condition',
        'is_triggered',
        'triggered_at',
    ];

    /**
     * Ép kiểu dữ liệu
     */
    protected $casts = [
        'target_price' => 'decimal:8',
        'is_triggered' => 'boolean',
        'triggered_at' => 'datetime',
    ];

    /**
     * Cảnh báo này thuộc về một người dùng
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}