import posthog from 'posthog-js';
import { PostHogProvider as Provider, usePostHog } from '@posthog/react';
import { useLocation } from 'react-router';
import { useEffect } from 'react';

if (typeof window !== 'undefined') {
    const posthogKey = import.meta.env.VITE_POSTHOG_KEY;
    const posthogHost = import.meta.env.VITE_POSTHOG_HOST || 'https://us.i.posthog.com';

    if (posthogKey) {
        posthog.init(posthogKey, {
            api_host: posthogHost,
            person_profiles: 'always',
            capture_pageview: true // Habilitamos captura automática para mayor redundancia
        });
    }
}

export function PostHogPageView() {
    const location = useLocation();
    const posthog = usePostHog();

    useEffect(() => {
        if (posthog && location) {
            posthog.capture('$pageview', {
                $current_url: window.location.href,
            });
        }
    }, [location, posthog]);

    return null;
}

export function PostHogProvider({ children }: { children: React.ReactNode }) {
    return (
        <Provider client={posthog}>
            {children}
        </Provider>
    );
}
