<?php
namespace App\GraphQL\Queries;

use App\Services\CryptoPriceService;

class CryptoPriceBatchResolver
{
    /**
     * @param  null  $_
     * @param  array{symbols: string[]}  $args
     */
    public function __invoke($_, array $args)
    {
        $symbols = $args['symbols'];
        $batchData = CryptoPriceService::getBatchPriceData($symbols);

        $results = [];
        foreach ($symbols as $s) {
            $upper = strtoupper($s);
            $data = $batchData[$upper] ?? ['price' => 0, 'change' => 0];

            $results[] = [
                'symbol' => $upper,
                'price' => $data['price'],
                'change_24h' => $data['change'],
            ];
        }

        return $results;
    }
}