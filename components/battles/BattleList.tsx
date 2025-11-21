import { useState } from 'react';
import { Battle } from '@/lib/types';
import BattleRow from './BattleRow';

interface BattleListProps {
    battles: Battle[];
}

export default function BattleList({ battles }: BattleListProps) {
    const [expandedBattleId, setExpandedBattleId] = useState<string | null>(null);

    // Helper to generate a unique ID if battleTime isn't unique enough (though it usually is)
    // Ideally backend sends a unique ID.
    const getBattleId = (battle: Battle) => battle.battleTime;

    const handleToggle = (id: string) => {
        setExpandedBattleId(prev => (prev === id ? null : id));
    };

    if (battles.length === 0) {
        return (
            <div className="text-center py-12 text-gray-500">
                Nenhuma batalha encontrada com os filtros atuais.
            </div>
        );
    }

    return (
        <div className="space-y-2">
            {battles.map((battle) => {
                const id = getBattleId(battle);
                return (
                    <BattleRow
                        key={id}
                        battle={battle}
                        isExpanded={expandedBattleId === id}
                        onToggle={() => handleToggle(id)}
                    />
                );
            })}
        </div>
    );
}
