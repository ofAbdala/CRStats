'use client';

import { useState } from 'react';
import { Check, Copy, Share2 } from 'lucide-react';
import { trackEvent } from '@/lib/analytics';

interface ShareProfileProps {
    tag: string;
    playerName?: string;
}

/**
 * Component for sharing player profile links
 * 
 * Displays the current profile URL and allows copying to clipboard
 * with visual feedback.
 */
export default function ShareProfile({ tag, playerName }: ShareProfileProps) {
    const [copied, setCopied] = useState(false);

    // Construct the profile URL
    const profileUrl = typeof window !== 'undefined'
        ? `${window.location.origin}/${tag}`
        : `https://x1.clashdex.com/${tag}`;

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(profileUrl);
            setCopied(true);

            trackEvent('share_profile_copy_link', {
                tag,
                playerName
            });

            // Reset copied state after 2 seconds
            setTimeout(() => setCopied(false), 2000);
        } catch (error) {
            console.error('Failed to copy to clipboard:', error);
        }
    };

    return (
        <div className="premium-gradient border border-gray-800 p-6 rounded-2xl">
            <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-600/20 flex items-center justify-center">
                    <Share2 className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                    <h3 className="text-lg font-medium text-white">Compartilhar Perfil</h3>
                    <p className="text-sm text-gray-400 font-light">Envie este link para seus amigos</p>
                </div>
            </div>

            <div className="flex gap-2">
                <input
                    type="text"
                    value={profileUrl}
                    readOnly
                    className="flex-1 px-4 py-3 rounded-xl bg-gray-900 border border-gray-800 text-gray-300 text-sm font-mono focus:outline-none focus:border-gray-700 cursor-text select-all"
                    onClick={(e) => e.currentTarget.select()}
                />

                <button
                    onClick={handleCopy}
                    className={`
            px-6 py-3 rounded-xl font-medium text-sm transition-all duration-300 flex items-center gap-2 whitespace-nowrap
            ${copied
                            ? 'bg-green-500 text-white'
                            : 'bg-white text-black hover:bg-gray-100'
                        }
          `}
                >
                    {copied ? (
                        <>
                            <Check className="w-4 h-4" />
                            <span>Copiado!</span>
                        </>
                    ) : (
                        <>
                            <Copy className="w-4 h-4" />
                            <span>Copiar</span>
                        </>
                    )}
                </button>
            </div>

            {copied && (
                <p className="text-xs text-green-400 mt-2 flex items-center gap-1">
                    <Check className="w-3 h-3" />
                    Link copiado para a área de transferência
                </p>
            )}
        </div>
    );
}
