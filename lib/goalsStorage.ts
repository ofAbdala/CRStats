export interface PlayerGoal {
    id: string;
    type: 'trophies' | 'wins' | 'winstreak' | 'custom';
    label: string;
    target: number;
    current: number;
    createdAt: string;
    expiresAt?: string;
}

const STORAGE_PREFIX = 'cr_stats_goals_';

/**
 * Save goals for a specific player
 */
export function saveGoals(playerTag: string, goals: PlayerGoal[]): void {
    if (typeof window === 'undefined') return;

    const key = STORAGE_PREFIX + playerTag.replace('#', '');
    localStorage.setItem(key, JSON.stringify(goals));
}

/**
 * Load goals for a specific player
 */
export function loadGoals(playerTag: string): PlayerGoal[] {
    if (typeof window === 'undefined') return [];

    const key = STORAGE_PREFIX + playerTag.replace('#', '');
    const data = localStorage.getItem(key);

    if (!data) return [];

    try {
        return JSON.parse(data);
    } catch {
        return [];
    }
}

/**
 * Add a new goal
 */
export function addGoal(
    playerTag: string,
    goal: Omit<PlayerGoal, 'id' | 'createdAt'>
): PlayerGoal {
    const goals = loadGoals(playerTag);

    const newGoal: PlayerGoal = {
        ...goal,
        id: `goal_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        createdAt: new Date().toISOString()
    };

    goals.push(newGoal);
    saveGoals(playerTag, goals);

    return newGoal;
}

/**
 * Update an existing goal
 */
export function updateGoal(
    playerTag: string,
    goalId: string,
    updates: Partial<Omit<PlayerGoal, 'id' | 'createdAt'>>
): PlayerGoal | null {
    const goals = loadGoals(playerTag);
    const index = goals.findIndex(g => g.id === goalId);

    if (index === -1) return null;

    goals[index] = { ...goals[index], ...updates };
    saveGoals(playerTag, goals);

    return goals[index];
}

/**
 * Delete a goal
 */
export function deleteGoal(playerTag: string, goalId: string): boolean {
    const goals = loadGoals(playerTag);
    const filtered = goals.filter(g => g.id !== goalId);

    if (filtered.length === goals.length) return false;

    saveGoals(playerTag, filtered);
    return true;
}

/**
 * Get active goals (not expired)
 */
export function getActiveGoals(playerTag: string): PlayerGoal[] {
    const goals = loadGoals(playerTag);
    const now = new Date();

    return goals.filter(goal => {
        if (!goal.expiresAt) return true;
        return new Date(goal.expiresAt) > now;
    });
}

/**
 * Calculate progress percentage
 */
export function getGoalProgress(goal: PlayerGoal): number {
    if (goal.target === 0) return 0;
    return Math.min(100, Math.round((goal.current / goal.target) * 100));
}

/**
 * Check if goal is completed
 */
export function isGoalCompleted(goal: PlayerGoal): boolean {
    return goal.current >= goal.target;
}

/**
 * Get default goals for a new player
 */
export function getDefaultGoals(currentTrophies: number): Omit<PlayerGoal, 'id' | 'createdAt'>[] {
    const nextLeague = Math.ceil((currentTrophies + 1) / 1000) * 1000;

    return [
        {
            type: 'trophies',
            label: 'Próxima Liga',
            target: nextLeague,
            current: currentTrophies
        },
        {
            type: 'wins',
            label: 'Vitórias Hoje',
            target: 5,
            current: 0,
            expiresAt: getEndOfDay().toISOString()
        }
    ];
}

/**
 * Get end of current day
 */
function getEndOfDay(): Date {
    const date = new Date();
    date.setHours(23, 59, 59, 999);
    return date;
}
