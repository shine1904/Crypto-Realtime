<?php
namespace App\Services;

use Illuminate\Support\Facades\Redis;

class CryptoPriceService
{
    /**
     * Map input symbol (e.g. BTCUSDT or BTC) to the standard Redis short symbol (BTC)
     */
    public static function getShortSymbol(string $symbol)
    {
        $symbol = strtoupper($symbol);
        if (str_ends_with($symbol, 'USDT')) {
            return substr($symbol, 0, -4);
        }
        return $symbol;
    }

    /**
     * Lấy dữ liệu cho 1 đồng coin
     */
    public static function getPriceData(string $symbol)
    {
        $short = self::getShortSymbol($symbol);
        
        $price = Redis::get("crypto:price:{$short}");
        $change = Redis::get("crypto:change:{$short}");

        return [
            'price' => $price ? (float) $price : 0.0,
            'change' => $change ? (float) $change : 0.0,
        ];
    }

    /**
     * Lấy dữ liệu theo lô (Batch) - Tối ưu bằng MGET
     */
    public static function getBatchPriceData(array $symbols)
    {
        if (empty($symbols)) return [];

        $mapped = [];
        $allKeys = [];

        foreach ($symbols as $inputSymbol) {
            $short = self::getShortSymbol($inputSymbol);
            $priceKey = "crypto:price:{$short}";
            $changeKey = "crypto:change:{$short}";
            
            $allKeys[] = $priceKey;
            $allKeys[] = $changeKey;
            
            $mapped[$inputSymbol] = [
                'priceKey' => $priceKey,
                'changeKey' => $changeKey
            ];
        }

        $values = Redis::mget($allKeys);
        $valueMap = array_combine($allKeys, $values);

        $results = [];
        foreach ($symbols as $inputSymbol) {
            $m = $mapped[$inputSymbol];
            $price = $valueMap[$m['priceKey']] ?? 0;
            $change = $valueMap[$m['changeKey']] ?? 0;

            $results[strtoupper($inputSymbol)] = [
                'price' => (float) $price,
                'change' => (float) $change,
            ];
        }

        return $results;
    }
}