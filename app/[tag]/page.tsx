import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import PublicProfileClient from './PublicProfileClient';

interface PageProps {
    params: {
        tag: string;
    };
}

/**
 * Normalize player tag
 * Removes # prefix and converts to uppercase
 */
function normalizeTag(tag: string): string {
    return tag.replace(/^#/, '').trim().toUpperCase();
}

/**
 * Fetch player data for metadata generation
 */
async function getPlayerData(tag: string) {
    try {
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
        const response = await fetch(`${baseUrl}/api/player/${tag}`, {
            cache: 'no-store'
        });

        if (!response.ok) {
            return null;
        }

        return await response.json();
    } catch (error) {
        console.error('Failed to fetch player data for metadata:', error);
        return null;
    }
}

/**
 * Generate metadata for SEO
 */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const normalizedTag = normalizeTag(params.tag);
    const playerData = await getPlayerData(normalizedTag);

    if (!playerData) {
        return {
            title: 'CR Status – Perfil de Jogador',
            description: 'Visualize estatísticas e histórico de batalhas no Clash Royale com o CR Status.',
        };
    }

    const title = `CR Status – ${playerData.name} (#${normalizedTag})`;
    const description = `Veja as estatísticas, badges e histórico de batalhas de ${playerData.name} no Clash Royale. ${playerData.trophies?.toLocaleString()} troféus • ${playerData.arena || 'Arena desconhecida'}`;

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            url: `/${normalizedTag}`,
            type: 'profile',
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
        },
    };
}

/**
 * Public profile page
 * Accessible via /{tag} URL
 */
export default function PublicProfilePage({ params }: PageProps) {
    const normalizedTag = normalizeTag(params.tag);

    // Validate tag format (basic validation)
    if (!normalizedTag || normalizedTag.length < 3) {
        notFound();
    }

    return <PublicProfileClient tag={normalizedTag} />;
}
