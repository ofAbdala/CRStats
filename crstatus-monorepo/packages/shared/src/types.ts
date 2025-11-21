// Core types for CR Status
export type Player = {
    id: string;
    tag: string;
    name: string;
    trophies: number;
    bestTrophies?: number;
    expLevel?: number;
    wins?: number;
    losses?: number;
    clanTag?: string | null;
    clanName?: string | null;
    lastSyncedAt: string; // ISO date
};

export type Battle = {
    id: string;
    playerTag: string;
    opponentTag: string;
    opponentName?: string;
    battleTime: string; // ISO date
    gameMode: string;
    result: 'win' | 'loss' | 'draw';
    trophyChange: number;
    crownsFor?: number;
    crownsAgainst?: number;
};

export type PushSession = {
    id: string;
    playerTag: string;
    startTime: string;
    endTime: string;
    durationMinutes: number;
    wins: number;
    losses: number;
    draws: number;
    winrate: number;
    trophyDeltaTotal: number;
    isActive: boolean;
    battles: Battle[];
};

export type Goal = {
    id: string;
    playerTag: string;
    userId?: string;
    targetTrophies: number;
    description?: string;
    createdAt: string;
    completedAt?: string | null;
};

export type PlayerTag = {
    id: string;
    userId: string;
    tag: string;
    label?: string;
    createdAt: string;
};

export type AnalyticsEvent = {
    id: string;
    userId?: string;
    name: string;
    payload?: Record<string, any>;
    createdAt: string;
};

// Database types (matching Supabase schema)
export type Database = {
    public: {
        Tables: {
            player_tags: {
                Row: PlayerTag;
                Insert: Omit<PlayerTag, 'id' | 'createdAt'>;
                Update: Partial<Omit<PlayerTag, 'id' | 'createdAt'>>;
            };
            players: {
                Row: Player;
                Insert: Omit<Player, 'id'>;
                Update: Partial<Omit<Player, 'id' | 'tag'>>;
            };
            battles: {
                Row: Battle;
                Insert: Omit<Battle, 'id'>;
                Update: Partial<Omit<Battle, 'id'>>;
            };
            sessions: {
                Row: Omit<PushSession, 'battles'>;
                Insert: Omit<PushSession, 'id' | 'battles'>;
                Update: Partial<Omit<PushSession, 'id' | 'battles'>>;
            };
            goals: {
                Row: Goal;
                Insert: Omit<Goal, 'id' | 'createdAt'>;
                Update: Partial<Omit<Goal, 'id' | 'createdAt'>>;
            };
            events: {
                Row: AnalyticsEvent;
                Insert: Omit<AnalyticsEvent, 'id' | 'createdAt'>;
                Update: never;
            };
        };
    };
};
