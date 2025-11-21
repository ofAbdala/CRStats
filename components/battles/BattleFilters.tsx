import { motion } from 'framer-motion';
import { Filter } from 'lucide-react';
import { trackEvent } from '@/lib/analytics';

interface BattleFiltersProps {
    filters: {
        result: string;
        mode: string;
        limit: number;
    };
    onFilterChange: (key: string, value: string | number) => void;
}

export default function BattleFilters({ filters, onFilterChange }: BattleFiltersProps) {
    const handleChange = (key: string, value: string | number) => {
        onFilterChange(key, value);
        trackEvent('battle_filter_change', {
            [key]: value,
            result: key === 'result' ? value : filters.result,
            mode: key === 'mode' ? value : filters.mode,
            limit: key === 'limit' ? value : filters.limit
        });
    };

    return (
        <div className="flex flex-wrap items-center gap-4 mb-6">
            <div className="flex items-center gap-2 text-gray-400 text-sm font-medium mr-2">
                <Filter className="w-4 h-4" />
                <span>Filtros:</span>
            </div>

            {/* Result Filter */}
            <div className="flex items-center bg-gray-900 rounded-xl p-1 border border-gray-800">
                {['all', 'win', 'loss', 'draw'].map((option) => (
                    <button
                        key={option}
                        onClick={() => onFilterChange('result', option)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${filters.result === option
                            ? 'bg-gray-800 text-white shadow-sm'
                            : 'text-gray-500 hover:text-gray-300'
                            }`}
                    >
                        {option === 'all' && 'Todos'}
                        {option === 'win' && 'Vitórias'}
                        {option === 'loss' && 'Derrotas'}
                        {option === 'draw' && 'Empates'}
                    </button>
                ))}
            </div>

            {/* Mode Filter */}
            <div className="flex items-center bg-gray-900 rounded-xl p-1 border border-gray-800">
                {['all', 'ladder', 'challenge'].map((option) => (
                    <button
                        key={option}
                        onClick={() => onFilterChange('mode', option)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${filters.mode === option
                            ? 'bg-gray-800 text-white shadow-sm'
                            : 'text-gray-500 hover:text-gray-300'
                            }`}
                    >
                        {option === 'all' && 'Todos'}
                        {option === 'ladder' && 'Ladder'}
                        {option === 'challenge' && 'Desafios'}
                    </button>
                ))}
            </div>

            {/* Limit Filter */}
            <div className="flex items-center bg-gray-900 rounded-xl p-1 border border-gray-800 ml-auto">
                {[5, 10, 20].map((option) => (
                    <button
                        key={option}
                        onClick={() => onFilterChange('limit', option)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${filters.limit === option
                            ? 'bg-gray-800 text-white shadow-sm'
                            : 'text-gray-500 hover:text-gray-300'
                            }`}
                    >
                        {option}
                    </button>
                ))}
            </div>
        </div>
    );
}
