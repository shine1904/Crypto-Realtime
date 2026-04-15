<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Transaction extends Model
{
    use HasFactory;

    /**
     * Danh sách các cột cho phép ghi dữ liệu hàng loạt (Mass Assignment)
     */
    protected $fillable = [
        'user_id',
        'coin_symbol',
        'type',   // BUY hoặc SELL
        'amount',
        'price',
        'fee',
    ];

    /**
     * Tự động ép kiểu dữ liệu khi lấy ra từ Database
     */
    protected $casts = [
        'amount' => 'decimal:8',
        'price' => 'decimal:8',
        'fee' => 'decimal:8',
        'created_at' => 'datetime',
    ];

    /**
     * Liên kết: Giao dịch này thuộc về một User nào đó
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}