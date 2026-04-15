<?php

namespace App\GraphQL\Queries;

use App\Models\NewsArticle;

class LatestNewsResolver
{
    /**
     * @param  null  $_
     * @param  array<string, mixed>  $args
     */
    public function __invoke($_, array $args)
    {
        $limit = $args['limit'] ?? 10;
        
        return NewsArticle::orderBy('published_at', 'desc')
            ->limit($limit)
            ->get();
    }
}
