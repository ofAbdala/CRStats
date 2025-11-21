'use client';

import { useState, useEffect, useCallback } from 'react';
import { trackEvent } from './analytics';

export interface FavoritePlayer {
    tag: string;
    name: string;
    trophies?: number;
    addedAt: number;
}

const STORAGE_KEY = 'cr-stats-favorite-players';

/**
 * Custom hook for managing favorite players
 * 
 * Currently uses localStorage for persistence.
 * 
 * TODO: Future database sync
 * - When user is authenticated, sync favorites to database
 * - Use SWR or React Query for server state management
 * - Implement optimistic updates
 * - Handle conflicts between local and server state
 */
export function useFavoritePlayers() {
    const [favorites, setFavorites] = useState<FavoritePlayer[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);

    // Load favorites from localStorage on mount
    useEffect(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                const parsed = JSON.parse(stored);
                setFavorites(Array.isArray(parsed) ? parsed : []);
            }
        } catch (error) {
            console.error('Failed to load favorite players:', error);
        } finally {
            setIsLoaded(true);
        }
    }, []);

    // Save favorites to localStorage whenever they change
    useEffect(() => {
        if (isLoaded) {
            try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
            } catch (error) {
                console.error('Failed to save favorite players:', error);
            }
        }
    }, [favorites, isLoaded]);

    /**
     * Add a player to favorites
     */
    const addFavorite = useCallback((tag: string, name: string, trophies?: number) => {
        setFavorites(prev => {
            // Check if already exists
            if (prev.some(p => p.tag === tag)) {
                return prev;
            }

            const newFavorite: FavoritePlayer = {
                tag,
                name,
                trophies,
                addedAt: Date.now()
            };

            trackEvent('player_save', { tag, name });

            return [...prev, newFavorite];
        });
    }, []);

    /**
     * Remove a player from favorites
     */
    const removeFavorite = useCallback((tag: string) => {
        setFavorites(prev => {
            const filtered = prev.filter(p => p.tag !== tag);

            if (filtered.length !== prev.length) {
                trackEvent('player_remove', { tag });
            }

            return filtered;
        });
    }, []);

    /**
     * Check if a player is favorited
     */
    const isFavorite = useCallback((tag: string) => {
        return favorites.some(p => p.tag === tag);
    }, [favorites]);

    /**
     * Clear all favorites
     */
    const clearFavorites = useCallback(() => {
        setFavorites([]);
        localStorage.removeItem(STORAGE_KEY);
    }, []);

    return {
        favorites,
        addFavorite,
        removeFavorite,
        isFavorite,
        clearFavorites,
        isLoaded
    };
}
