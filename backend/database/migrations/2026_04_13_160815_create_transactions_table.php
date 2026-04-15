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
    public function up(): void
    {
        Schema::create('transactions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('coin_symbol', 20);
            $table->enum('type', ['BUY', 'SELL']);
            
            // Decimal 24, 8: Đảm bảo không mất 1 satoshi nào khi tính toán
            $table->decimal('amount', 24, 8); 
            $table->decimal('price', 24, 8);
            $table->decimal('fee', 24, 8)->default(0);
            
            $table->timestamps();

            // Index giúp việc truy vấn lịch sử giao dịch của 1 coin nhanh hơn
            $table->index(['user_id', 'coin_symbol']);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down(): void
    {
        // Xóa bảng khi thực hiện lệnh rollback
        Schema::dropIfExists('transactions');
    }
};