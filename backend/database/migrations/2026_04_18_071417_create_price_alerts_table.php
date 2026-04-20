<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('price_alerts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('symbol', 20)->index(); // Coin người dùng muốn theo dõi
            
            // Giá mục tiêu: dùng decimal(18, 8) để chính xác tuyệt đối như Binance
            $table->decimal('target_price', 18, 8);
            
            // Điều kiện: 'above' (giá tăng đến mức) hoặc 'below' (giá giảm xuống mức)
            $table->enum('condition', ['above', 'below']);
            
            // Trạng thái: false = đang đợi, true = đã gửi mail rồi (tránh spam)
            $table->boolean('is_triggered')->default(false)->index();
            
            $table->timestamp('triggered_at')->nullable();
            $table->timestamps();

            // Index kết hợp để Job Price Watcher quét nhanh hơn
            $table->index(['symbol', 'is_triggered']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('price_alerts');
    }
};