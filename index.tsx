import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App';

const rootElement = document.getElementById('root');
if (!rootElement) {
    throw new Error('Could not find root element to mount to');
}

import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

// @ts-ignore (avoid TS errors if types are missing)
window.Pusher = Pusher;

const apiBase =
    import.meta.env.VITE_API_URL?.replace(/\/api\/v1\/?$/, '') ?? '';

const echo = new Echo({
    broadcaster: 'pusher',
    key: import.meta.env.VITE_REVERB_APP_KEY,
    wsHost: import.meta.env.VITE_REVERB_HOST,
    wsPort: import.meta.env.VITE_REVERB_PORT,
    wssPort: import.meta.env.VITE_REVERB_PORT,
    forceTLS: import.meta.env.VITE_REVERB_SCHEME === 'https',
    enabledTransports: ['ws', 'wss'],
    disableStats: true,
    cluster: '',
    authEndpoint: `${apiBase}/api/broadcasting/auth`,
    auth: {
        headers: {
            get Authorization() {
                return `Bearer ${localStorage.getItem('token') ?? ''}`;
            },
            Accept: 'application/json'
        }
    }
});
console.log(echo);

window.Echo = echo; // Optional: make globally available (for debugging)

const root = ReactDOM.createRoot(rootElement);
root.render(
    <React.StrictMode>
        <Router>
            <App />
        </Router>
    </React.StrictMode>
);
