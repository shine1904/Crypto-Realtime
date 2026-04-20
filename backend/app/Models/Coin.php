<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Coin extends Model
{
    use HasFactory;

    protected $fillable = [
        'symbol',
        'name',
        'base_asset',
        'icon_url',
        'is_active',
        'sort_order',
    ];

    /**
     * Một đồng coin có thể có nhiều cảnh báo giá từ nhiều người dùng
     */
    public function alerts(): HasMany
    {
        return $this->hasMany(PriceAlert::class, 'symbol', 'symbol');
    }

    /**
     * Scope để chỉ lấy các coin đang hoạt động
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }
}