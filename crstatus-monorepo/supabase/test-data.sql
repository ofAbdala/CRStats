-- Test data for CR Status
-- Run this after applying schema.sql

-- Insert a test player
INSERT INTO players (tag, name, trophies, best_trophies, exp_level, wins, losses, clan_tag, clan_name)
VALUES 
  ('ABC123', 'Test Player', 6500, 7200, 14, 1500, 1200, 'CLAN456', 'Test Clan')
ON CONFLICT (tag) DO UPDATE SET
  name = EXCLUDED.name,
  trophies = EXCLUDED.trophies,
  best_trophies = EXCLUDED.best_trophies;

-- Insert test battles for session detection
-- Session 1: Active session (wins, good performance)
INSERT INTO battles (player_tag, opponent_tag, opponent_name, battle_time, game_mode, result, trophy_change, crowns_for, crowns_against)
VALUES
  -- Battle 1 (10 min ago)
  ('ABC123', 'OPP001', 'Opponent 1', NOW() - INTERVAL '10 minutes', 'Ladder', 'win', 30, 3, 1),
  -- Battle 2 (15 min ago)
  ('ABC123', 'OPP002', 'Opponent 2', NOW() - INTERVAL '15 minutes', 'Ladder', 'win', 28, 3, 0),
  -- Battle 3 (25 min ago)
  ('ABC123', 'OPP003', 'Opponent 3', NOW() - INTERVAL '25 minutes', 'Ladder', 'loss', -25, 1, 3),
  -- Battle 4 (35 min ago)
  ('ABC123', 'OPP004', 'Opponent 4', NOW() - INTERVAL '35 minutes', 'Ladder', 'win', 29, 3, 2),
  -- Battle 5 (45 min ago)
  ('ABC123', 'OPP005', 'Opponent 5', NOW() - INTERVAL '45 minutes', 'Ladder', 'win', 31, 3, 1)
ON CONFLICT (player_tag, battle_time, opponent_tag) DO NOTHING;

-- Session 2: Past session (2 hours ago, mixed results)
INSERT INTO battles (player_tag, opponent_tag, opponent_name, battle_time, game_mode, result, trophy_change, crowns_for, crowns_against)
VALUES
  ('ABC123', 'OPP006', 'Opponent 6', NOW() - INTERVAL '2 hours', 'Ladder', 'loss', -28, 1, 3),
  ('ABC123', 'OPP007', 'Opponent 7', NOW() - INTERVAL '2 hours 10 minutes', 'Ladder', 'loss', -30, 0, 3),
  ('ABC123', 'OPP008', 'Opponent 8', NOW() - INTERVAL '2 hours 20 minutes', 'Ladder', 'win', 27, 3, 2),
  ('ABC123', 'OPP009', 'Opponent 9', NOW() - INTERVAL '2 hours 30 minutes', 'Ladder', 'loss', -29, 2, 3),
  ('ABC123', 'OPP010', 'Opponent 10', NOW() - INTERVAL '2 hours 40 minutes', 'Ladder', 'win', 26, 3, 1)
ON CONFLICT (player_tag, battle_time, opponent_tag) DO NOTHING;

-- Session 3: Past session (6 hours ago, tilt warning)
INSERT INTO battles (player_tag, opponent_tag, opponent_name, battle_time, game_mode, result, trophy_change, crowns_for, crowns_against)
VALUES
  ('ABC123', 'OPP011', 'Opponent 11', NOW() - INTERVAL '6 hours', 'Ladder', 'loss', -32, 0, 3),
  ('ABC123', 'OPP012', 'Opponent 12', NOW() - INTERVAL '6 hours 8 minutes', 'Ladder', 'loss', -30, 1, 3),
  ('ABC123', 'OPP013', 'Opponent 13', NOW() - INTERVAL '6 hours 15 minutes', 'Ladder', 'loss', -28, 2, 3),
  ('ABC123', 'OPP014', 'Opponent 14', NOW() - INTERVAL '6 hours 22 minutes', 'Ladder', 'loss', -31, 1, 3)
ON CONFLICT (player_tag, battle_time, opponent_tag) DO NOTHING;

-- Singles (battles with > 30min gap)
INSERT INTO battles (player_tag, opponent_tag, opponent_name, battle_time, game_mode, result, trophy_change, crowns_for, crowns_against)
VALUES
  ('ABC123', 'OPP015', 'Opponent 15', NOW() - INTERVAL '1 day', 'Ladder', 'win', 29, 3, 1),
  ('ABC123', 'OPP016', 'Opponent 16', NOW() - INTERVAL '1 day 2 hours', 'Ladder', 'loss', -27, 1, 3)
ON CONFLICT (player_tag, battle_time, opponent_tag) DO NOTHING;

-- Verify data
SELECT 'Total battles inserted:' as info, COUNT(*) as count FROM battles WHERE player_tag = 'ABC123';
SELECT 'Players inserted:' as info, COUNT(*) as count FROM players WHERE tag = 'ABC123';
