'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { Award } from 'lucide-react';
import { fadeInUp, cardHover } from '@/utils/animations';

interface PlayerBadgesProps {
    badges: any[];
}

export default function PlayerBadges({ badges }: PlayerBadgesProps) {
    if (!badges || badges.length === 0) {
        return null;
    }

    return (
        <motion.div
            initial={fadeInUp.initial}
            animate={fadeInUp.animate}
            transition={fadeInUp.transition}
            whileHover={cardHover}
            className="premium-gradient border border-gray-800 p-8 rounded-3xl card-glow gpu-accelerated group"
        >
            <div className="flex items-center gap-4 mb-8">
                <motion.div
                    className="w-12 h-12 bg-gray-900 rounded-2xl flex items-center justify-center group-hover:bg-gray-800 transition-all duration-300"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                >
                    <Award className="w-7 h-7 text-white" />
                </motion.div>
                <div>
                    <h2 className="text-2xl font-medium text-white group-hover:text-glow transition-all duration-300">
                        Conquistas
                    </h2>
                    <p className="text-gray-400 font-light">{badges.length} badges desbloqueadas</p>
                </div>
            </div>

            <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
                {badges.map((badge, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.05, duration: 0.4 }}
                        whileHover={{ scale: 1.1, y: -4 }}
                        className="relative group/badge"
                        title={badge.name}
                    >
                        <div className="w-full aspect-square bg-gray-900 rounded-2xl p-2 relative overflow-hidden border border-gray-800 group-hover/badge:border-gray-600 transition-all duration-300">
                            {badge.iconUrls?.large ? (
                                <Image
                                    src={badge.iconUrls.large}
                                    alt={badge.name}
                                    fill
                                    className="object-contain p-1"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-2xl">
                                    🏆
                                </div>
                            )}
                        </div>

                        {/* Tooltip on hover */}
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-black/90 text-white text-xs rounded-lg opacity-0 group-hover/badge:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none z-10">
                            {badge.name}
                            {badge.level && <span className="ml-1 text-yellow-400">Nv.{badge.level}</span>}
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Progress indicator if applicable */}
            {badges.some(b => b.progress !== undefined) && (
                <div className="mt-8 pt-8 border-t border-gray-800">
                    <div className="text-sm text-gray-400 font-light">
                        Progresso total: {badges.filter(b => b.progress === 100 || b.progress === undefined).length}/{badges.length} completas
                    </div>
                </div>
            )}
        </motion.div>
    );
}
