import { motion } from 'framer-motion';
import { Users, Heart, Swords, Trophy, Star } from 'lucide-react';

interface ClanViewProps {
    player: any;
}

export default function ClanView({ player }: ClanViewProps) {
    if (!player.clan) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="premium-gradient border border-gray-800 p-12 rounded-3xl text-center card-glow"
            >
                <Users className="w-16 h-16 text-gray-600 mx-auto mb-6" />
                <h2 className="text-2xl font-light text-white mb-2">Sem Clã</h2>
                <p className="text-gray-400 font-light">Este jogador não pertence a nenhum clã no momento.</p>
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
        >
            {/* Clan Header */}
            <div className="premium-gradient border border-gray-800 p-8 rounded-3xl card-glow relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                    <Users className="w-64 h-64 text-white" />
                </div>

                <div className="relative z-10">
                    <div className="flex items-center gap-6 mb-6">
                        <div className="w-20 h-20 bg-gray-900 rounded-2xl flex items-center justify-center border border-gray-700">
                            {/* Placeholder for Clan Badge - ideally we'd construct the URL if we had the logic */}
                            <Users className="w-10 h-10 text-white" />
                        </div>
                        <div>
                            <h2 className="text-4xl font-light text-white text-glow mb-2">{player.clan}</h2>
                            <div className="flex items-center gap-4">
                                <span className="text-gray-400 font-mono text-sm">#{player.clanTag}</span>
                                <span className="px-3 py-1 bg-white/10 rounded-full text-xs font-medium text-white">Membro</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Player Contribution Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="premium-gradient border border-gray-800 p-6 rounded-3xl"
                >
                    <div className="flex items-center gap-3 mb-2 text-green-400">
                        <Heart className="w-5 h-5" />
                        <span className="font-medium">Doações</span>
                    </div>
                    <div className="text-3xl font-light text-white mb-1">{player.donations}</div>
                    <div className="text-xs text-gray-500">Esta semana</div>
                </motion.div>

                <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="premium-gradient border border-gray-800 p-6 rounded-3xl"
                >
                    <div className="flex items-center gap-3 mb-2 text-blue-400">
                        <Heart className="w-5 h-5" />
                        <span className="font-medium">Recebidas</span>
                    </div>
                    <div className="text-3xl font-light text-white mb-1">{player.donationsReceived}</div>
                    <div className="text-xs text-gray-500">Esta semana</div>
                </motion.div>

                <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="premium-gradient border border-gray-800 p-6 rounded-3xl"
                >
                    <div className="flex items-center gap-3 mb-2 text-red-400">
                        <Swords className="w-5 h-5" />
                        <span className="font-medium">Guerra</span>
                    </div>
                    <div className="text-3xl font-light text-white mb-1">{player.warDayWins}</div>
                    <div className="text-xs text-gray-500">Vitórias dia de guerra</div>
                </motion.div>

                <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="premium-gradient border border-gray-800 p-6 rounded-3xl"
                >
                    <div className="flex items-center gap-3 mb-2 text-yellow-400">
                        <Star className="w-5 h-5" />
                        <span className="font-medium">Coletas</span>
                    </div>
                    <div className="text-3xl font-light text-white mb-1">{player.clanCardsCollected}</div>
                    <div className="text-xs text-gray-500">Cartas coletadas</div>
                </motion.div>
            </div>

            {/* Total Contribution */}
            <div className="premium-gradient border border-gray-800 p-8 rounded-3xl">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-light text-white">Contribuição Total</h3>
                    <Trophy className="w-6 h-6 text-yellow-500" />
                </div>
                <div className="flex items-end gap-2">
                    <span className="text-5xl font-light text-white text-glow">{player.totalDonations?.toLocaleString()}</span>
                    <span className="text-gray-400 mb-2">cartas doadas em toda a carreira</span>
                </div>
            </div>
        </motion.div>
    );
}
