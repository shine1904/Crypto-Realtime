<?php

return [
    // Cho phép tất cả các đường dẫn bắt đầu bằng api/ và graphql
    'paths' => ['api/*', 'graphql', 'graphql/*', 'sanctum/csrf-cookie'],

    'allowed_methods' => ['*'], // Cho phép GET, POST, OPTIONS...

    // Quan trọng: Phải khớp với URL Next.js của bạn
    'allowed_origins' => ['http://localhost:3000', 'http://127.0.0.1:3000'], 

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'], // Cho phép các Header như Authorization, Content-Type

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => true, // Cần thiết nếu sau này bạn làm Login/Cookie
];