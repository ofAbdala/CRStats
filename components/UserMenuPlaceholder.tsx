'use client';

import Link from 'next/link';
import { User, Crown } from 'lucide-react';
import { trackEvent } from '@/lib/analytics';

/**
 * User menu placeholder component
 * 
 * Currently shows "Sign in" placeholder since auth is not implemented.
 * 
 * TODO: Future auth integration
 * - Replace with actual auth provider (Supabase/NextAuth/Clerk)
 * - Show user avatar and name when logged in
 * - Add dropdown menu with:
 *   - Account settings
 *   - Billing/subscription
 *   - Sign out
 * - Handle authentication state
 */
export default function UserMenuPlaceholder() {
    // TODO: Replace with actual auth check
    // const { user, signIn, signOut } = useAuth();
    const user = null;

    const handlePricingClick = () => {
        trackEvent('pricing_cta_click', { source: 'header' });
    };

    return (
        <div className="flex items-center gap-3">
            {/* PRO Button */}
            <Link
                href="/pricing"
                onClick={handlePricingClick}
                className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white text-sm font-medium transition-all duration-300 shadow-lg hover:shadow-emerald-500/50"
            >
                <Crown className="w-4 h-4" />
                <span>CR Status PRO</span>
            </Link>

            {/* User Menu */}
            {user ? (
                // TODO: Implement actual user menu
                <div className="flex items-center gap-3 px-4 py-2 rounded-2xl bg-gray-900 border border-gray-800">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                        <span className="text-sm font-medium text-white">U</span>
                    </div>
                    <span className="text-sm text-white font-medium">User</span>
                </div>
            ) : (
                <button
                    disabled
                    className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-gray-900 border border-gray-800 text-gray-400 text-sm font-medium cursor-not-allowed opacity-60"
                    title="Authentication coming soon"
                >
                    <User className="w-4 h-4" />
                    <span className="hidden sm:inline">Entrar</span>
                </button>
            )}
        </div>
    );
}
