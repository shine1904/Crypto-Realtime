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
    Schema::table('users', function (Blueprint $table) {
        $table->string('google_id')->nullable()->unique();
        $table->string('avatar')->nullable();
        // Cho phép password null vì user login Google không có pass ngay lúc đầu
        $table->string('password')->nullable()->change();
    });
}

    /**
     * Reverse the migrations.
     *
     * @return void
     */
   public function down()
{
    Schema::table('users', function (Blueprint $table) {
        $table->dropColumn(['google_id', 'avatar']);
        $table->string('password')->nullable(false)->change();
    });
}
};
