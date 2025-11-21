import { Metadata } from 'next';
import ClanPageClient from './ClanPageClient';

interface PageProps {
    params: {
        tag: string;
    };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const tag = params.tag.replace(/^#/, '').toUpperCase();

    return {
        title: `Clã #${tag} - CR Status`,
        description: `Veja estatísticas detalhadas e membros do clã #${tag} no Clash Royale`,
    };
}

export default function ClanPage({ params }: PageProps) {
    return <ClanPageClient tag={params.tag} />;
}
