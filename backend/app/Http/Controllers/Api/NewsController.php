<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\NewsArticle;
use Illuminate\Http\Request;

class NewsController extends Controller
{
    public function index()
    {
        $news = NewsArticle::orderBy('published_at', 'desc')->limit(12)->get();
        return response()->json($news);
    }
}
