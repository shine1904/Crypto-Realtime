<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Wallet extends Model
{
    protected $fillable = ['user_id', 'coin_symbol', 'amount', 'avg_buy_price'];

    // Quan hệ với User
    public function user() {
        return $this->belongsTo(User::class);
    }
}