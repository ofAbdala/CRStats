import { createServerClient } from '@crstatus/shared';
import PlayerClient from './PlayerClient';

export default async function PlayerPage({ params }: { params: Promise<{ tag: string }> }) {
    const { tag } = await params;
    const supabase = createServerClient();

    // Fetch player data
    const { data: player } = await supabase
        .from('players')
        .select('*')
        .eq('tag', tag.toUpperCase())
        .single();

    // Fetch battles for this player
    const { data: battles } = await supabase
        .from('battles')
        .select('*')
        .eq('player_tag', tag.toUpperCase())
        .order('battle_time', { ascending: false })
        .limit(100);

    return <PlayerClient player={player} battles={battles || []} />;
}
