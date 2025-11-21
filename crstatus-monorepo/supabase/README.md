# Supabase Configuration

This directory contains the Supabase database schema and configuration.

## Project Information

- **Project URL:** https://tjfzplxjsffddlvwtdtq.supabase.co
- **Project Ref:** tjfzplxjsffddlvwtdtq

## Setup

### 1. Install Supabase CLI

```bash
npm install -g supabase
```

### 2. Login to Supabase

```bash
supabase login
```

### 3. Link to Project

```bash
supabase link --project-ref tjfzplxjsffddlvwtdtq
```

### 4. Apply Schema

To create all tables and policies in your Supabase project:

```bash
supabase db push
```

Or manually run the SQL in the Supabase dashboard:
1. Go to https://supabase.com/dashboard/project/tjfzplxjsffddlvwtdtq/sql
2. Copy the contents of `schema.sql`
3. Paste and run

## Database Structure

### Tables

- **player_tags**: User's saved player tags (private, RLS enabled)
- **players**: Cached player data from Supercell API (public read)
- **battles**: Battle history (public read)
- **sessions**: Detected push sessions (public read)
- **goals**: Trophy goals (private, RLS enabled)
- **events**: Analytics events (private, RLS enabled)

### Row Level Security (RLS)

- **player_tags, goals, events**: Only accessible by the owner (auth.uid())
- **players, battles, sessions**: Public read access for all users
- Service role has full access to all tables for API sync operations

### Indexes

All tables have appropriate indexes for performance:
- Foreign keys
- Frequently queried columns
- Time-based sorting columns

## Storage (Optional)

If you need to store assets (images, etc.):

1. Go to Storage in Supabase dashboard
2. Create a bucket called `public-assets`
3. Set it to public access

## Edge Functions (Future)

For analytics tracking edge function:

```bash
supabase functions new track-event
```

## Migration Workflow

When making schema changes:

1. Edit `schema.sql`
2. Test locally: `supabase db reset`
3. Push to production: `supabase db push`

## Notes

- Always use service role key for write operations from backend
- Use anon key for client-side read operations
- RLS policies prevent unauthorized access even with anon key
