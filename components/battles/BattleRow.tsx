import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, ChevronUp, Trophy, Swords, Crown } from 'lucide-react';
import { Battle } from '@/lib/types';
import { timeAgo } from '@/lib/time_utils';
import BattleDetails from './BattleDetails';
import { useStreamerMode } from '@/lib/useStreamerMode';

interface BattleRowProps {
    battle: Battle;
    isExpanded: boolean;
    onToggle: () => void;
}

export default function BattleRow({ battle, isExpanded, onToggle }: BattleRowProps) {
    // Defensive check for battle structure
    if (!battle.team || !battle.team[0] || !battle.opponent || !battle.opponent[0]) {
        return null; // Skip rendering invalid battles
    }

    // Determine result
    const myTeam = battle.team[0];
    const result = myTeam.crowns > battle.opponent[0].crowns ? 'win' : myTeam.crowns < battle.opponent[0].crowns ? 'loss' : 'draw';

    const resultColor = {
        win: 'border-l-4 border-l-green-500 bg-green-500/5 hover:bg-green-500/10',
        loss: 'border-l-4 border-l-red-500 bg-red-500/5 hover:bg-red-500/10',
        draw: 'border-l-4 border-l-gray-500 bg-gray-500/5 hover:bg-gray-500/10'
    }[result];

    const resultText = {
        win: 'Vitória',
        loss: 'Derrota',
        draw: 'Empate'
    }[result];

    const resultTextColor = {
        win: 'text-green-400',
        loss: 'text-red-400',
        draw: 'text-gray-400'
    }[result];

    return (
        <motion.div
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`mb-2 rounded-xl overflow-hidden border border-gray-800/50 transition-colors ${resultColor}`}
        >
            <div
                onClick={onToggle}
                className="p-4 cursor-pointer flex items-center justify-between gap-4"
            >
                {/* Left: Result & Mode */}
                <div className="flex items-center gap-4 min-w-[140px]">
                    <div>
                        <div className={`font-bold ${resultTextColor}`}>{resultText}</div>
                        <div className="text-xs text-gray-500 flex items-center gap-1">
                            <Swords className="w-3 h-3" />
                            {battle.gameMode.name}
                        </div>
                    </div>
                </div>

                {/* Middle: Crowns & Trophies */}
                <div className="flex items-center gap-6 flex-1 justify-center">
                    <div className="flex items-center gap-2 text-sm font-medium text-white">
                        <span className="flex items-center gap-1">
                            <Crown className="w-4 h-4 text-yellow-500" />
                            {myTeam.crowns}
                        </span>
                        <span className="text-gray-600">-</span>
                        <span className="flex items-center gap-1">
                            {battle.opponent[0].crowns}
                            <Crown className="w-4 h-4 text-gray-600" />
                        </span>
                    </div>

                    {myTeam.trophyChange !== undefined && (
                        <div className={`text-sm font-medium flex items-center gap-1 ${myTeam.trophyChange > 0 ? 'text-green-400' : 'text-red-400'}`}>
                            <Trophy className="w-3 h-3" />
                            {myTeam.trophyChange > 0 ? '+' : ''}{myTeam.trophyChange}
                        </div>
                    )}
                </div>

                {/* Right: Time & Toggle */}
                <div className="flex items-center gap-4 min-w-[100px] justify-end">
                    <div className="text-xs text-gray-500 text-right">
                        {timeAgo(battle.battleTime)}
                    </div>
                    <div className="text-gray-500">
                        {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </div>
                </div>
            </div>

            {/* Expandable Details */}
            <BattleDetails battle={battle} isExpanded={isExpanded} />
        </motion.div>
    );
}
