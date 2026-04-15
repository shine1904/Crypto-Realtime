<?php

namespace App\GraphQL\Queries;
use App\Services\CryptoPriceService;

class CryptoPriceResolver
{
    /**
     * @param  null  $_
     * @param  array{symbol: string}  $args
     */
    public function __invoke($_, array $args)
    {
        $symbol = strtoupper($args['symbol']);
        $data = CryptoPriceService::getPriceData($symbol);

        return [
            'symbol'     => $symbol,
            'price'      => $data['price'],
            'change_24h' => $data['change'],
        ];
    }
}