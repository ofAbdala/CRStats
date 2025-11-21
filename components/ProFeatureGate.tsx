'use client';

import Link from 'next/link';
import { Lock } from 'lucide-react';
import { trackEvent } from '@/lib/analytics';

interface ProFeatureGateProps {
    children: React.ReactNode;
    label?: string;
}

/**
 * Component to gate PRO features
 * 
 * Currently shows all features as locked (isPro = false).
 * 
 * TODO: Future auth integration
 * - Check user.plan === 'pro' from auth context
 * - Allow access if user has active PRO subscription
 * - Handle trial periods
 * - Show upgrade prompts based on user state
 */
export default function ProFeatureGate({ children, label }: ProFeatureGateProps) {
    // Check for PRO mode via localStorage (dev), environment variable, or query parameter
    const forceProByLocalStorage = typeof window !== 'undefined' && localStorage.getItem('dev_pro_mode') === 'true';
    const forceProByEnv = typeof process !== 'undefined' && process.env.NEXT_PUBLIC_FORCE_PRO === 'true';
    const forceProByQuery = typeof window !== 'undefined' && window.location.search.includes('pro=1');

    // Future: const { user } = useAuth(); const isPro = user?.plan === 'pro';
    const isPro = forceProByLocalStorage || forceProByEnv || forceProByQuery;

    const handleProClick = () => {
        trackEvent('pro_feature_click', { label });
    };

    if (isPro) {
        return <>{children}</>;
    }

    return (
        <div className="relative">
            {/* Blurred content preview */}
            <div className="opacity-30 pointer-events-none blur-sm">
                {children}
            </div>

            {/* Overlay with CTA */}
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-black/80 backdrop-blur-sm rounded-3xl">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
                    <Lock className="w-8 h-8 text-white" />
                </div>

                <div className="text-center px-6">
                    <h3 className="text-xl font-medium text-white mb-2">
                        {label || 'Recurso Exclusivo PRO'}
                    </h3>
                    <p className="text-sm text-gray-400 font-light max-w-md">
                        Desbloqueie recursos avançados com o CR Status PRO
                    </p>
                </div>

                <Link
                    href="/pricing"
                    onClick={handleProClick}
                    className="px-6 py-3 text-sm font-medium rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white transition-all duration-300 shadow-lg hover:shadow-emerald-500/50"
                >
                    Saiba mais sobre o CR Status PRO
                </Link>
            </div>
        </div>
    );
}
