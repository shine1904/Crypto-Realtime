<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('coins', function (Blueprint $table) {
            $table->id();
            $table->string('symbol', 20)->unique(); // Ví dụ: BTCUSDT, ETHUSDT
            $table->string('name', 100);             // Ví dụ: Bitcoin, Ethereum
            $table->string('base_asset', 20)->default('USDT');
            $table->string('icon_url')->nullable();  // Link ảnh logo coin
            $table->boolean('is_active')->default(true)->index();
            $table->integer('sort_order')->default(0); // Thứ tự hiển thị trên bảng Market
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('coins');
    }
};