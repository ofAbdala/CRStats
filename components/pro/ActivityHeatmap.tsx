import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Battle } from '@/lib/types';
import { Clock, TrendingUp, TrendingDown, Star, AlertTriangle } from 'lucide-react';
import { analyzeActivityPatterns, getTimeSlotLabel } from '@/lib/activityAnalysis';

interface ActivityHeatmapProps {
    battles: Battle[];
}

export default function ActivityHeatmap({ battles }: ActivityHeatmapProps) {
    const [hoveredCell, setHoveredCell] = useState<{ day: number; slot: number } | null>(null);

    const analysis = useMemo(() => analyzeActivityPatterns(battles), [battles]);
    const { heatmapData, bestTimes, worstTimes, recommendation } = analysis;

    const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    const timeSlots = ['0h-4h', '4h-8h', '8h-12h', '12h-16h', '16h-20h', '20h-24h'];

    // Find max for normalization
    const maxCount = Math.max(...heatmapData.flat().map(c => c.count));

    const isBestTime = (day: number, slot: number) => {
        return bestTimes.some(t => t.day === day && t.slot === slot);
    };

    const isWorstTime = (day: number, slot: number) => {
        return worstTimes.some(t => t.day === day && t.slot === slot);
    };

    return (
        <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-6">
                <Clock className="w-5 h-5 text-purple-400" />
                <h3 className="text-lg font-medium text-white">Mapa de Atividade</h3>
            </div>

            {/* Best/Worst Times Summary */}
            {(bestTimes.length > 0 || worstTimes.length > 0) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                    {bestTimes.length > 0 && (
                        <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-3">
                            <div className="flex items-center gap-2 mb-1">
                                <Star className="w-4 h-4 text-green-400" />
                                <span className="text-xs font-bold text-green-400">MELHOR HORÁRIO</span>
                            </div>
                            <p className="text-sm text-white">
                                {getTimeSlotLabel(bestTimes[0].day, bestTimes[0].slot)} • {bestTimes[0].winrate.toFixed(0)}% WR
                            </p>
                        </div>
                    )}
                    {worstTimes.length > 0 && (
                        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3">
                            <div className="flex items-center gap-2 mb-1">
                                <AlertTriangle className="w-4 h-4 text-red-400" />
                                <span className="text-xs font-bold text-red-400">EVITAR</span>
                            </div>
                            <p className="text-sm text-white">
                                {getTimeSlotLabel(worstTimes[0].day, worstTimes[0].slot)} • {worstTimes[0].winrate.toFixed(0)}% WR
                            </p>
                        </div>
                    )}
                </div>
            )}

            <div className="overflow-x-auto">
                <div className="min-w-[600px]">
                    {/* Header */}
                    <div className="grid grid-cols-[60px_repeat(6,1fr)] gap-2 mb-2">
                        <div />
                        {timeSlots.map(slot => (
                            <div key={slot} className="text-xs text-gray-500 text-center font-medium">{slot}</div>
                        ))}
                    </div>

                    {/* Grid */}
                    <div className="space-y-2">
                        {days.map((day, dayIndex) => (
                            <div key={day} className="grid grid-cols-[60px_repeat(6,1fr)] gap-2 items-center">
                                <div className="text-xs text-gray-400 font-bold">{day}</div>
                                {heatmapData[dayIndex].map((cell, slotIndex) => {
                                    const intensity = maxCount > 0 ? cell.count / maxCount : 0;
                                    const isBest = isBestTime(dayIndex, slotIndex);
                                    const isWorst = isWorstTime(dayIndex, slotIndex);
                                    const isHovered = hoveredCell?.day === dayIndex && hoveredCell?.slot === slotIndex;

                                    return (
                                        <div
                                            key={slotIndex}
                                            className="relative"
                                            onMouseEnter={() => setHoveredCell({ day: dayIndex, slot: slotIndex })}
                                            onMouseLeave={() => setHoveredCell(null)}
                                        >
                                            <motion.div
                                                initial={{ scale: 0.8, opacity: 0 }}
                                                animate={{ scale: 1, opacity: 1 }}
                                                transition={{ delay: (dayIndex * 6 + slotIndex) * 0.01 }}
                                                className={`
                                                    h-10 rounded-lg transition-all duration-300 relative
                                                    ${cell.count === 0 ? 'bg-gray-800/30' : 'bg-purple-500'}
                                                    ${isBest ? 'ring-2 ring-green-400' : ''}
                                                    ${isWorst ? 'ring-2 ring-red-400' : ''}
                                                    ${isHovered ? 'scale-110 z-10' : ''}
                                                    cursor-pointer
                                                `}
                                                style={{ opacity: cell.count === 0 ? 1 : 0.2 + (intensity * 0.8) }}
                                            >
                                                {isBest && (
                                                    <Star className="absolute -top-1 -right-1 w-3 h-3 text-green-400" />
                                                )}
                                                {isWorst && (
                                                    <AlertTriangle className="absolute -top-1 -right-1 w-3 h-3 text-red-400" />
                                                )}
                                            </motion.div>

                                            {/* Tooltip */}
                                            <AnimatePresence>
                                                {isHovered && cell.count > 0 && (
                                                    <motion.div
                                                        initial={{ opacity: 0, y: 5 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        exit={{ opacity: 0, y: 5 }}
                                                        className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-20 pointer-events-none"
                                                    >
                                                        <div className="bg-gray-900 border border-gray-700 rounded-lg p-3 shadow-xl min-w-[200px]">
                                                            <div className="text-xs font-bold text-white mb-2">
                                                                {day} {timeSlots[slotIndex]}
                                                            </div>
                                                            <div className="space-y-1 text-xs">
                                                                <div className="flex justify-between">
                                                                    <span className="text-gray-400">Partidas:</span>
                                                                    <span className="text-white font-medium">{cell.count}</span>
                                                                </div>
                                                                <div className="flex justify-between">
                                                                    <span className="text-gray-400">Winrate:</span>
                                                                    <span className={cell.winrate >= 50 ? 'text-green-400' : 'text-red-400'}>
                                                                        {cell.winrate.toFixed(0)}%
                                                                    </span>
                                                                </div>
                                                                <div className="flex justify-between">
                                                                    <span className="text-gray-400">V/D:</span>
                                                                    <span className="text-white">
                                                                        {cell.wins}/{cell.losses}
                                                                    </span>
                                                                </div>
                                                                <div className="flex justify-between">
                                                                    <span className="text-gray-400">Troféus:</span>
                                                                    <span className={cell.trophyChange > 0 ? 'text-green-400' : cell.trophyChange < 0 ? 'text-red-400' : 'text-gray-400'}>
                                                                        {cell.trophyChange > 0 ? '+' : ''}{cell.trophyChange}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="w-2 h-2 bg-gray-900 border-r border-b border-gray-700 absolute top-full left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-45" />
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    );
                                })}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Legend */}
            <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span>Menos</span>
                    <div className="flex gap-1">
                        <div className="w-3 h-3 rounded bg-gray-800/30" />
                        <div className="w-3 h-3 rounded bg-purple-500/20" />
                        <div className="w-3 h-3 rounded bg-purple-500/60" />
                        <div className="w-3 h-3 rounded bg-purple-500" />
                    </div>
                    <span>Mais</span>
                </div>

                <div className="flex items-center gap-4 text-xs">
                    <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-green-400" />
                        <span className="text-gray-500">Melhor</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3 text-red-400" />
                        <span className="text-gray-500">Evitar</span>
                    </div>
                </div>
            </div>

            {/* Recommendation */}
            {recommendation && (
                <div className="mt-4 p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl">
                    <div className="flex items-start gap-3">
                        <TrendingUp className="w-5 h-5 text-blue-400 mt-0.5" />
                        <p className="text-sm text-blue-100">{recommendation}</p>
                    </div>
                </div>
            )}
        </div>
    );
}
