/**
 * Analytics tracking for events
 * 
 * In development: logs to console
 * In production: sends to Supabase Edge Function
 */

export type AnalyticsEvent =
    | 'session_detected'
    | 'goal_created'
    | 'goal_completed'
    | 'player_tag_added'
    | 'battle_synced'
    | 'page_view'
    | 'tab_change'
    | 'filter_change';

export async function trackEvent(
    name: AnalyticsEvent,
    payload?: Record<string, any>
): Promise<void> {
    const isDev = process.env.NODE_ENV === 'development';

    if (isDev) {
        console.log('[Analytics]', name, payload || {});
        return;
    }

    try {
        // In production, send to Supabase Edge Function
        const response = await fetch('/api/track', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, payload })
        });

        if (!response.ok) {
            console.error('Failed to track event:', name);
        }
    } catch (error) {
        console.error('Error tracking event:', error);
    }
}

/**
 * Identify user for analytics
 */
export async function identifyUser(
    userId: string,
    traits?: Record<string, any>
): Promise<void> {
    const isDev = process.env.NODE_ENV === 'development';

    if (isDev) {
        console.log('[Analytics] Identify:', userId, traits);
        return;
    }

    try {
        await fetch('/api/identify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, traits })
        });
    } catch (error) {
        console.error('Error identifying user:', error);
    }
}
