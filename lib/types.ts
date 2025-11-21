export interface Card {
    name: string;
    id: number;
    level: number;
    maxLevel: number;
    iconUrls: {
        medium: string;
        evolutionMedium?: string;
    };
    elixirCost?: number;
    rarity?: string;
}

export interface Player {
    tag: string;
    name: string;
    expLevel: number;
    trophies: number;
    bestTrophies: number;
    wins: number;
    losses: number;
    battleCount: number;
    threeCrownWins: number;
    challengeCardsWon: number;
    tournamentCardsWon: number;
    tournamentBattleCount: number;
    role: string;
    donations: number;
    donationsReceived: number;
    totalDonations: number;
    warDayWins: number;
    clanCardsCollected: number;
    clan?: {
        tag: string;
        name: string;
        badgeId: number;
    };
    arena?: {
        id: number;
        name: string;
    };
    leagueStatistics?: {
        currentSeason: {
            trophies: number;
            bestTrophies: number;
        };
        previousSeason: {
            id: string;
            trophies: number;
            bestTrophies: number;
        };
        bestSeason: {
            id: string;
            trophies: number;
        };
    };
    badges?: Badge[];
    currentDeck?: Card[];
    cards?: Card[];
}

export interface Badge {
    name: string;
    level: number;
    maxLevel: number;
    progress: number;
    target: number;
    iconUrls: {
        large: string;
    };
}

export interface Battle {
    type: string;
    battleTime: string;
    isLadderTournament: boolean;
    arena: {
        id: number;
        name: string;
    };
    gameMode: {
        id: number;
        name: string;
    };
    deckSelection: string;
    team: {
        tag: string;
        name: string;
        startingTrophies: number;
        trophyChange: number;
        crowns: number;
        kingTowerHitPoints: number;
        princessTowersHitPoints: number[] | null;
        clan: {
            tag: string;
            name: string;
            badgeId: number;
        };
        cards: Card[];
        elixirLeaked: number;
    }[];
    opponent: {
        tag: string;
        name: string;
        startingTrophies: number;
        trophyChange: number;
        crowns: number;
        kingTowerHitPoints: number;
        princessTowersHitPoints: number[] | null;
        clan: {
            tag: string;
            name: string;
            badgeId: number;
        };
        cards: Card[];
        elixirLeaked: number;
    }[];
    tournamentTag?: string;
}

export interface DeckStat {
    id: string;
    cards: Card[];
    matches: number;
    wins: number;
    losses: number;
    draws: number;
    winrate: number;
    avgElixir: number;
}

export interface LeaderboardPlayer {
    tag: string;
    name: string;
    rank: number;
    trophies: number;
    clan?: {
        tag: string;
        name: string;
        badgeId: number;
    };
    arena?: {
        id: number;
        name: string;
    };
}

export interface Clan {
    tag: string;
    name: string;
    type: string;
    description: string;
    badgeId: number;
    clanScore: number;
    clanWarTrophies: number;
    location: {
        id: number;
        name: string;
        isCountry: boolean;
        countryCode: string;
    };
    requiredTrophies: number;
    donationsPerWeek: number;
    clanChestStatus: string;
    clanChestLevel: number;
    members: ClanMember[];
    memberList?: ClanMember[]; // Supercell API sometimes uses memberList
}

export interface ClanMember {
    tag: string;
    name: string;
    role: string;
    lastSeen: string;
    expLevel: number;
    trophies: number;
    arena: {
        id: number;
        name: string;
    };
    clanRank: number;
    previousClanRank: number;
    donations: number;
    donationsReceived: number;
}

export interface MetaDeck {
    id: string;
    cards: Card[];
    avgElixir: number;
    popularity: number;
    winrate: number;
    rank: number;
    mode: string;
}
