import "@/lib/echo"
import { createInertiaApp } from '@inertiajs/svelte';
import QueryLayout from "@/layouts/QueryLayout.svelte";

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    http: {
        xsrfCookieName: 'MY-XSRF-TOKEN',
        xsrfHeaderName: 'X-MY-XSRF-TOKEN',
    },
    title: (title) => (title ? `${title} - ${appName}` : appName),
    layout: () => QueryLayout,
    progress: {
        color: '#4B5563',
    },
});
