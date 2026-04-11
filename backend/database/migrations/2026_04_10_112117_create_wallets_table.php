<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
{
    Schema::create('wallets', function (Blueprint $table) {
        $table->id();
        $table->foreignId('user_id')->constrained()->onDelete('cascade');
        $table->string('coin_symbol'); // Ví dụ: BTC, ETH, SOL
        $table->decimal('amount', 20, 10)->default(0); // Số lượng coin nắm giữ
        $table->decimal('avg_buy_price', 20, 10)->nullable(); // Giá mua trung bình để tính P&L
        $table->timestamps();
        
        // Tránh trùng lặp: một user chỉ có 1 bản ghi cho mỗi loại coin
        $table->unique(['user_id', 'coin_symbol']);
    });
}

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('wallets');
    }
};
