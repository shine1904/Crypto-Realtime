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
    Schema::create('holdings', function (Blueprint $table) {
        $table->id();
        $table->foreignId('user_id')->constrained()->onDelete('cascade');
        $table->string('coin_symbol', 20);
        $table->decimal('amount', 24, 8)->default(0);
        $table->decimal('average_buy_price', 24, 8)->default(0);
        $table->timestamps();

        $table->unique(['user_id', 'coin_symbol']);
    });
}

/**
 * Reverse the migrations.
 */
public function down(): void
{
    // Lệnh này sẽ xóa bảng nếu bạn muốn quay lại trạng thái trước đó
    Schema::dropIfExists('holdings');
}
};
