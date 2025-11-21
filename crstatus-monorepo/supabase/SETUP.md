# Database Setup Guide

## Quick Start - Apply Schema to Supabase

### Option 1: Using Supabase Dashboard (Recommended)

1. **Go to SQL Editor**:
   - Visit: https://supabase.com/dashboard/project/tjfzplxjsffddlvwtdtq/sql

2. **Run Schema**:
   - Click "New Query"
   - Copy the entire contents of `schema.sql`
   - Paste into the editor
   - Click "Run" or press Cmd/Ctrl + Enter

3. **Run Test Data** (Optional):
   - Create another new query
   - Copy the entire contents of `test-data.sql`
   - Paste and run

4. **Verify**:
   - Go to Table Editor
   - You should see 6 tables: player_tags, players, battles, sessions, goals, events
   - Check "Test Player" in players table
   - Check battles data

### Option 2: Using psql (If you have PostgreSQL client)

```bash
# Get connection string from Supabase dashboard
# Settings → Database → Connection string

psql "postgresql://postgres:[PASSWORD]@db.tjfzplxjsffddlvwtdtq.supabase.co:5432/postgres" \
  -f supabase/schema.sql

# Then apply test data
psql "postgresql://postgres:[PASSWORD]@db.tjfzplxjsffddlvwtdtq.supabase.co:5432/postgres" \
  -f supabase/test-data.sql
```

### Option 3: Using Supabase CLI (If installed)

```bash
# Make sure you're linked to the project
supabase link --project-ref tjfzplxjsffddlvwtdtq

# Apply schema
supabase db push

# Or run specific SQL files
supabase db execute --file supabase/schema.sql
supabase db execute --file supabase/test-data.sql
```

## What the Schema Creates

### Tables

1. **player_tags** - User's saved player tags (RLS: private)
2. **players** - Cached player data (RLS: public read)
3. **battles** - Battle history (RLS: public read)
4. **sessions** - Detected push sessions (RLS: public read)
5. **goals** - Trophy goals (RLS: private)
6. **events** - Analytics events (RLS: private)

### Test Data Included

When you run `test-data.sql`, you'll get:

- **1 Test Player**: "Test Player" (#ABC123) with 6500 trophies
- **17 Battles** demonstrating session detection:
  - **Session 1** (active, 10-45 min ago): 5 battles, 4W-1L, +93 trophies 🔥
  - **Session 2** (2 hours ago): 5 battles, 2W-3L, -34 trophies 📉
  - **Session 3** (6 hours ago): 4 battles, 0W-4L, -121 trophies ⚠️ TILT
  - **Singles**: 2 isolated battles

This data is perfect for testing:
- ✅ Active session detection (green highlight)
- ✅ Intelligent messages (excellent push / tilt warning)
- ✅ Session vs chronological view toggle
- ✅ Positive/negative trophy delta colors
- ✅ Winrate calculations

## Verification Queries

After applying schema and test data, run these in SQL Editor to verify:

```sql
-- Check all tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- Check RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY tablename;

-- View test player
SELECT * FROM players WHERE tag = 'ABC123';

-- View all battles
SELECT 
  battle_time,
  game_mode,
  result,
  trophy_change,
  opponent_name
FROM battles 
WHERE player_tag = 'ABC123'
ORDER BY battle_time DESC;

-- Count battles per timeframe
SELECT 
  CASE 
    WHEN battle_time > NOW() - INTERVAL '1 hour' THEN 'Last hour (Active session)'
    WHEN battle_time > NOW() - INTERVAL '3 hours' THEN '1-3 hours ago'
    WHEN battle_time > NOW() - INTERVAL '12 hours' THEN '3-12 hours ago'
    ELSE '12+ hours ago'
  END as timeframe,
  COUNT(*) as battles,
  SUM(CASE WHEN result = 'win' THEN 1 ELSE 0 END) as wins,
  SUM(CASE WHEN result = 'loss' THEN 1 ELSE 0 END) as losses,
  SUM(trophy_change) as delta
FROM battles
WHERE player_tag = 'ABC123'
GROUP BY timeframe
ORDER BY timeframe;
```

## Common Issues

### "relation already exists"
- Safe to ignore if re-running
- Schema uses `IF NOT EXISTS` clauses

### "permission denied"
- Make sure you're using the service role key
- Or run via dashboard (automatically uses correct permissions)

### "foreign key violation"
- Make sure schema.sql runs before test-data.sql
- UUID extension must be enabled first

## Next Steps After Schema Applied

1. ✅ Verify tables in dashboard
2. ✅ Check test data loaded
3. 🚀 Run web app: `pnpm dev:web`
4. 🔐 Test login (magic link)
5. ➕ Add player tag #ABC123 in dashboard
6. 👁️ View player profile
7. ✨ See session detection in action!
