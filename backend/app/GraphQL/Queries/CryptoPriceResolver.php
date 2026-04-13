<?php

namespace App\GraphQL\Queries;
use App\Services\CryptoPriceService;

use Illuminate\Support\Facades\Redis;


class CryptoPriceResolver
{
    /**
     * @param  null  $_
     * @param  array{symbol: string}  $args
     */
    public function __invoke($_, array $args)
    {
        // Lấy symbol từ argument truyền vào (mặc định là BTCUSDT nếu thiếu)
        // Chúng ta nên strtoupper để khớp với key lưu trong Redis
        $data = CryptoPriceService::getPriceData($args['symbol']);
        $symbol = strtoupper($args['symbol']);

        // Lấy dữ liệu từ Redis (Dữ liệu này do lệnh php artisan crypto:update-prices nạp vào)
       $price=$data['price'];
       $change=$data['change'];

        // Nếu Redis chưa có dữ liệu (có thể do chưa chạy lệnh crawl), trả về 0 để tránh lỗi FE
        return [
            'symbol'     => $symbol,
            'price'      => $price ? (float) $price : 0.0,
            'change_24h' => $change ? (float) $change : 0.0,
        ];
    }
}