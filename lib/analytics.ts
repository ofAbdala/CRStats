/**
 * Analytics module for tracking user events
 * 
 * This is a stub implementation that logs events to console in development.
 * In the future, this will integrate with analytics services like:
 * - PostHog
 * - Amplitude
 * - Google Analytics 4
 * - Mixpanel
 */

export type AnalyticsEvent =
    | 'page_view'
    | 'player_search'
    | 'player_search_success'
    | 'player_search_error'
    | 'player_refresh'
    | 'player_save'
    | 'player_remove'
    | 'tab_change'
    | 'pro_feature_click'
    | 'deck_copy_link'
    | 'public_profile_view'
    | 'public_profile_error'
    | 'pricing_cta_click'
    | 'battle_filter_change'
    | 'performance_period_change'
    | 'player_compare_view'
    | 'player_compare_run'
    | 'leaderboard_global_view'
    | 'leaderboard_global_click_player'
    | 'leaderboard_country_change'
    | 'leaderboard_clan_view'
    | 'leaderboard_clan_click'
    | 'clan_view'
    | 'clan_member_click'
    | 'clan_internal_rank_view'
    | 'meta_decks_view'
    | 'meta_decks_click_deck'
    | 'streamer_mode_toggle'
    | 'share_profile_copy_link'
    | 'pricing_view'
    | 'history_view_mode_change'
    | 'history_period_change'
    | 'session_expand'
    | 'session_collapse'
    | 'goal_delete';

export interface AnalyticsPayload {
    [key: string]: string | number | boolean | undefined;
}

/**
 * Track a user event
 * @param name - Event name (use predefined types for type safety)
 * @param payload - Optional event metadata
 */
export function trackEvent(name: AnalyticsEvent, payload?: AnalyticsPayload): void {
    // Log to console in development
    if (process.env.NODE_ENV === 'development' || process.env.NEXT_PUBLIC_DEBUG_ANALYTICS === 'true') {
        console.log('[Analytics]', name, payload || {});
    }

    // TODO: Future integration points
    // - Send to PostHog: posthog.capture(name, payload)
    // - Send to Amplitude: amplitude.track(name, payload)
    // - Send to GA4: gtag('event', name, payload)
}

/**
 * Track page view
 * @param path - Page path
 */
export function trackPageView(path: string): void {
    trackEvent('pricing_view', { path });

    // TODO: Future integration
    // - PostHog: posthog.capture('$pageview', { path })
    // - GA4: gtag('config', 'GA_MEASUREMENT_ID', { page_path: path })
}

/**
 * Identify user (for future auth integration)
 * @param userId - User ID
 * @param traits - User properties
 */
export function identifyUser(userId: string, traits?: Record<string, any>): void {
    if (process.env.NODE_ENV === 'development') {
        console.log('[Analytics] Identify:', userId, traits);
    }

    // TODO: Future integration
    // - PostHog: posthog.identify(userId, traits)
    // - Amplitude: amplitude.setUserId(userId); amplitude.setUserProperties(traits)
}
