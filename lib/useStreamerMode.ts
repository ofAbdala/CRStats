import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface StreamerModeState {
    isEnabled: boolean;
    toggle: () => void;
    setEnabled: (enabled: boolean) => void;
}

export const useStreamerMode = create<StreamerModeState>()(
    persist(
        (set) => ({
            isEnabled: false,
            toggle: () => set((state) => ({ isEnabled: !state.isEnabled })),
            setEnabled: (enabled) => set({ isEnabled: enabled }),
        }),
        {
            name: 'streamer-mode-storage',
        }
    )
);
