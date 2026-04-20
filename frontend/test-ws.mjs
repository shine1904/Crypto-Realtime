import Pusher from 'pusher-js';

const pusher = new Pusher('app-key', {
  wsHost: '127.0.0.1',
  wsPort: 6001,
  forceTLS: false,
  disableStats: true,
  enabledTransports: ['ws']
});

pusher.connection.bind('connected', () => {
  console.log('Test listener connected');
});

pusher.connection.bind('message', (msg) => {
  console.log('RAW JSON:', msg);
});

const channel = pusher.subscribe('crypto-prices');
channel.bind_global((name, data) => {
  console.log('Event Name:', name);
  console.log('Payload:', data);
});
