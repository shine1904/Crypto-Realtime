<?php
require __DIR__ . '/vendor/autoload.php';

$c = new Predis\Client(['host' => '127.0.0.1', 'port' => 6380]);

$lua = <<<'LUA'
local alerts = redis.call('ZRANGEBYSCORE', KEYS[1], ARGV[1], ARGV[2])
if #alerts > 0 then
    redis.call('ZREM', KEYS[1], unpack(alerts))
end
return alerts
LUA;

echo "Testing Predis eval...\n";
$result = $c->eval($lua, 1, 'laravel_database_alerts:above:BTC', '-inf', '88000');
echo "Result: ";
var_dump($result);
