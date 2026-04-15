<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class NewsArticle extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'thumbnail_url',
        'source_name',
        'origin_url',
        'published_at',
    ];

    protected $dates = [
        'published_at',
    ];
}
