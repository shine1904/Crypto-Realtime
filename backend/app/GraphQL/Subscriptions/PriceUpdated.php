<?php declare(strict_types=1);

namespace App\GraphQL\Subscriptions;

use Illuminate\Http\Request;
use Nuwave\Lighthouse\Schema\Types\GraphQLSubscription;
use Nuwave\Lighthouse\Subscriptions\Subscriber;
use App\Events\PriceUpdated as PriceUpdatedEvent;

final class PriceUpdated extends GraphQLSubscription
{
    /** Check if subscriber is allowed to listen to the subscription. */
    public function authorize(Subscriber $subscriber, Request $request): bool
    {
        return true;
    }

    /** Filter which subscribers should receive the subscription. */
    public function filter(Subscriber $subscriber, mixed $root): bool
    {
        $requestedSymbols = $subscriber->args['symbols'] ?? [];
        if (empty($requestedSymbols)) {
            return true;
        }

        // Tùy thuộc vào payload truyền qua event
        $rootSymbol = is_object($root) && isset($root->symbol) ? $root->symbol : (is_array($root) ? ($root['symbol'] ?? null) : null);
        
        if (!$rootSymbol) {
            return false;
        }

        $upperRequested = array_map('strtoupper', $requestedSymbols);
        return in_array(strtoupper($rootSymbol), $upperRequested);
    }
    
    /**
     * Resolve the subscription field.
     */
    public function resolve(mixed $root, array $args, \Nuwave\Lighthouse\Support\Contracts\GraphQLContext $context, \GraphQL\Type\Definition\ResolveInfo $resolveInfo)
    {
        // Chuyển đổi Event/Array payload thành Schema structure (CryptoPrice)
        return [
            'symbol' => is_object($root) ? clone $root->symbol : $root['symbol'],
            'price' => is_object($root) ? $root->price : $root['price'],
            'change_24h' => is_object($root) ? $root->change_24h : $root['change_24h'],
        ];
    }
}
