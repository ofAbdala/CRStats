import { Card } from './types';
import { trackEvent } from './analytics';

/**
 * Generate Clash Royale deck deep link
 * Format: https://link.clashroyale.com/deck/en?deck=CARD_IDS
 */
export function generateDeckLink(cards: Card[]): string {
    if (!cards || cards.length === 0) {
        return '';
    }

    // Sort cards by ID for consistency
    const cardIds = cards
        .map(c => c.id)
        .sort()
        .join(';');

    return `https://link.clashroyale.com/deck/en?deck=${cardIds}`;
}

/**
 * Copy deck link to clipboard and track event
 */
export async function copyDeckLink(
    cards: Card[],
    source: string
): Promise<{ success: boolean; link: string; error?: string }> {
    try {
        const link = generateDeckLink(cards);

        if (!link) {
            return {
                success: false,
                link: '',
                error: 'No cards provided'
            };
        }

        // Copy to clipboard
        await navigator.clipboard.writeText(link);

        // Track event
        trackEvent('deck_copy_link', {
            source,
            cardCount: cards.length
        });

        return {
            success: true,
            link
        };
    } catch (error) {
        return {
            success: false,
            link: '',
            error: error instanceof Error ? error.message : 'Failed to copy'
        };
    }
}

/**
 * Format deck name from cards
 */
export function getDeckName(cards: Card[]): string {
    if (!cards || cards.length === 0) return 'Deck Vazio';
    if (cards.length < 8) return `Deck Incompleto (${cards.length}/8)`;

    // Get most prominent cards (highest rarity or most iconic)
    const champions = cards.filter(c => c.rarity === 'champion');
    const legendaries = cards.filter(c => c.rarity === 'legendary');

    if (champions.length > 0) {
        return champions.map(c => c.name).join(' + ');
    }

    if (legendaries.length >= 2) {
        return legendaries.slice(0, 2).map(c => c.name).join(' + ');
    }

    if (legendaries.length === 1) {
        return `${legendaries[0].name} Deck`;
    }

    return 'Deck Personalizado';
}

/**
 * Calculate average elixir cost
 */
export function getAverageElixir(cards: Card[]): number {
    if (!cards || cards.length === 0) return 0;

    const total = cards.reduce((sum, card) => sum + (card.elixirCost || 0), 0);
    return Math.round((total / cards.length) * 10) / 10;
}
