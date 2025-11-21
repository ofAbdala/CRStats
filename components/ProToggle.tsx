'use client';

import { useState, useEffect } from 'react';
import { Crown } from 'lucide-react';

export default function ProToggle() {
    const [isPro, setIsPro] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        // Check localStorage and URL
        const stored = localStorage.getItem('dev_pro_mode') === 'true';
        const urlPro = window.location.search.includes('pro=1');
        setIsPro(stored || urlPro);
    }, []);

    const toggle = () => {
        const newValue = !isPro;
        setIsPro(newValue);
        localStorage.setItem('dev_pro_mode', String(newValue));

        // Update URL
        const url = new URL(window.location.href);
        if (newValue) {
            url.searchParams.set('pro', '1');
        } else {
            url.searchParams.delete('pro');
        }
        window.history.replaceState({}, '', url);
        window.location.reload(); // Reload to apply changes
    };

    // Only show in development and after mount
    if (process.env.NODE_ENV !== 'development' || !mounted) return null;

    return (
        <button
            onClick={toggle}
            className={`fixed bottom-4 right-4 z-50 px-4 py-3 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-105 flex items-center gap-2 font-bold ${isPro
                    ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-emerald-500/50'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
            title="Toggle PRO mode (Development only)"
        >
            <Crown className="w-5 h-5" />
            <span className="text-sm">{isPro ? 'PRO MODE' : 'FREE MODE'}</span>
        </button>
    );
}
