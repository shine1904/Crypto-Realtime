<?php

namespace App\Console\Commands;

use App\Models\NewsArticle;
use Illuminate\Console\Command;

class FetchNews extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'news:fetch';
    protected $description = 'Fetch latest crypto news from RSS feeds';

    private $feeds = [
        'CoinTelegraph' => 'https://cointelegraph.com/rss',
        'CoinDesk' => 'https://www.coindesk.com/arc/outboundfeeds/rss/',
    ];

    public function handle()
    {
        $this->info('Starting news fetch...');

        foreach ($this->feeds as $sourceName => $url) {
            try {
                $this->info("Fetching from $sourceName...");
                $rss = \Feed::loadRss($url);

                $count = 0;
                foreach ($rss->item as $item) {
                    // Tránh lưu trùng lặp
                    $exists = NewsArticle::where('origin_url', (string)$item->link)->exists();
                    if ($exists) continue;

                    // Lấy ảnh từ nhiều nguồn khác nhau trong RSS (media:content, enclosure, hoặc thẻ img trong description)
                    $thumbnailUrl = $this->extractImage($item);

                    NewsArticle::create([
                        'title' => (string)$item->title,
                        'description' => strip_tags((string)$item->description),
                        'thumbnail_url' => $thumbnailUrl,
                        'source_name' => $sourceName,
                        'origin_url' => (string)$item->link,
                        'published_at' => date('Y-m-d H:i:s', (int)$item->timestamp),
                    ]);

                    $count++;
                    if ($count >= 10) break; // Chỉ lấy 10 tin mới nhất mỗi nguồn cho mỗi lần chạy
                }
                $this->info("Saved $count new articles from $sourceName.");
            } catch (\Exception $e) {
                $this->error("Failed to fetch from $sourceName: " . $e->getMessage());
            }
        }

        $this->info('News fetch completed!');
    }

    private function extractImage($item)
    {
        // 1. Kiểm tra media:content (phổ biến)
        if (isset($item->{'media:content'}['url'])) {
            return (string)$item->{'media:content'}['url'];
        }

        // 2. Kiểm tra enclosure (phổ biến)
        if (isset($item->enclosure['url'])) {
            return (string)$item->enclosure['url'];
        }

        // 3. Parse từ HTML description (fallback)
        $desc = (string)$item->description;
        if (preg_match('/<img.+src=["\']([^"\']+)["\']/', $desc, $matches)) {
            return $matches[1];
        }

        return null;
    }
}
