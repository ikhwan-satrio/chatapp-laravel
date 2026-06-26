// resources/js/lib/pusher.ts
import Pusher from 'pusher-js';

declare global {
    interface Window {
        Pusher: typeof Pusher;
        pusher: Pusher;
    }
}

const pusher = new Pusher(import.meta.env.VITE_REVERB_APP_KEY, {
    wsHost: import.meta.env.VITE_REVERB_HOST,
    wsPort: import.meta.env.VITE_REVERB_PORT,
    forceTLS: import.meta.env.VITE_REVERB_SCHEME === 'https',
    enabledTransports: ['ws', 'wss'],
    cluster: '',
});

window.pusher = pusher;

export default pusher;
