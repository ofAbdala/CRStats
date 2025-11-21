import { createServerClient } from '@crstatus/shared';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function createServerSupabaseClient() {
    const cookieStore = await cookies();
    const supabase = createServerClient();

    // Note: In production, you'd want to use @supabase/ssr for proper cookie handling
    // This is a simplified version for the initial setup
    return supabase;
}

export async function getUser() {
    const supabase = await createServerSupabaseClient();

    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
        return null;
    }

    return user;
}

export async function requireAuth() {
    const user = await getUser();

    if (!user) {
        redirect('/login');
    }

    return user;
}
