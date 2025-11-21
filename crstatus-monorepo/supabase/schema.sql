-- CR Status Database Schema
-- This schema creates all necessary tables for the application

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Player Tags: User's saved player tags
CREATE TABLE IF NOT EXISTS player_tags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tag TEXT NOT NULL,
  label TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, tag)
);

-- Players: Cached player data from Supercell API
CREATE TABLE IF NOT EXISTS players (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tag TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  trophies INT NOT NULL DEFAULT 0,
  best_trophies INT,
  exp_level INT,
  wins INT,
  losses INT,
  clan_tag TEXT,
  clan_name TEXT,
  last_synced_at TIMESTAMPTZ DEFAULT NOW()
);

-- Battles: Battle history
CREATE TABLE IF NOT EXISTS battles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  player_tag TEXT NOT NULL,
  opponent_tag TEXT NOT NULL,
  opponent_name TEXT,
  battle_time TIMESTAMPTZ NOT NULL,
  game_mode TEXT NOT NULL,
  result TEXT NOT NULL CHECK (result IN ('win', 'loss', 'draw')),
  trophy_change INT DEFAULT 0,
  crowns_for INT,
  crowns_against INT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(player_tag, battle_time, opponent_tag)
);

-- Sessions: Detected push sessions
CREATE TABLE IF NOT EXISTS sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  player_tag TEXT NOT NULL,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  duration_minutes INT NOT NULL,
  wins INT NOT NULL DEFAULT 0,
  losses INT NOT NULL DEFAULT 0,
  draws INT NOT NULL DEFAULT 0,
  winrate REAL NOT NULL DEFAULT 0,
  trophy_delta_total INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(player_tag, start_time)
);

-- Goals: Trophy goals set by users
CREATE TABLE IF NOT EXISTS goals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  player_tag TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  target_trophies INT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- Events: Analytics events
CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  payload JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_player_tags_user_id ON player_tags(user_id);
CREATE INDEX IF NOT EXISTS idx_players_tag ON players(tag);
CREATE INDEX IF NOT EXISTS idx_battles_player_tag ON battles(player_tag);
CREATE INDEX IF NOT EXISTS idx_battles_battle_time ON battles(battle_time DESC);
CREATE INDEX IF NOT EXISTS idx_sessions_player_tag ON sessions(player_tag);
CREATE INDEX IF NOT EXISTS idx_sessions_is_active ON sessions(is_active);
CREATE INDEX IF NOT EXISTS idx_goals_user_id ON goals(user_id);
CREATE INDEX IF NOT EXISTS idx_goals_player_tag ON goals(player_tag);
CREATE INDEX IF NOT EXISTS idx_events_user_id ON events(user_id);
CREATE INDEX IF NOT EXISTS idx_events_created_at ON events(created_at DESC);

-- Row Level Security (RLS)

-- Enable RLS
ALTER TABLE player_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- Player Tags policies
CREATE POLICY "Users can view their own player tags"
  ON player_tags FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own player tags"
  ON player_tags FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own player tags"
  ON player_tags FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own player tags"
  ON player_tags FOR DELETE
  USING (auth.uid() = user_id);

-- Goals policies
CREATE POLICY "Users can view their own goals"
  ON goals FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own goals"
  ON goals FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own goals"
  ON goals FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own goals"
  ON goals FOR DELETE
  USING (auth.uid() = user_id);

-- Events policies
CREATE POLICY "Users can view their own events"
  ON events FOR SELECT
  USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can insert their own events"
  ON events FOR INSERT
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- Public read access for players, battles, and sessions
-- (These are cached data from public API)
ALTER TABLE players ENABLE ROW LEVEL SECURITY;
ALTER TABLE battles ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read players"
  ON players FOR SELECT
  USING (true);

CREATE POLICY "Anyone can read battles"
  ON battles FOR SELECT
  USING (true);

CREATE POLICY "Anyone can read sessions"
  ON sessions FOR SELECT
  USING (true);

-- Service role can do everything (for API sync operations)
CREATE POLICY "Service role can manage players"
  ON players FOR ALL
  USING (auth.jwt() ->> 'role' = 'service_role');

CREATE POLICY "Service role can manage battles"
  ON battles FOR ALL
  USING (auth.jwt() ->> 'role' = 'service_role');

CREATE POLICY "Service role can manage sessions"
  ON sessions FOR ALL
  USING (auth.jwt() ->> 'role' = 'service_role');
