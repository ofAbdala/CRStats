import { requireAuth } from '@/lib/auth';
import { createServerClient } from '@crstatus/shared';
import DashboardClient from './DashboardClient';

export default async function DashboardPage() {
    const user = await requireAuth();
    const supabase = createServerClient();

    // Fetch user's player tags
    const { data: playerTags } = await supabase
        .from('player_tags')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

    return <DashboardClient user={user} playerTags={playerTags || []} />;
}
