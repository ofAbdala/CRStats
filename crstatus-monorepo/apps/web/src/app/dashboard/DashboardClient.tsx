'use client';

import { useState } from 'react';
import { createBrowserClient, type PlayerTag } from '@crstatus/shared';
import { Trophy, Plus, LogOut, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface DashboardClientProps {
    user: any;
    playerTags: PlayerTag[];
}

export default function DashboardClient({ user, playerTags: initialTags }: DashboardClientProps) {
    const [tags, setTags] = useState(initialTags);
    const [newTag, setNewTag] = useState('');
    const [label, setLabel] = useState('');
    const [loading, setLoading] = useState(false);
    const supabase = createBrowserClient();
    const router = useRouter();

    const handleAddTag = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTag) return;

        setLoading(true);
        try {
            const cleanTag = newTag.replace('#', '').toUpperCase();

            const { data, error } = await supabase
                .from('player_tags')
                .insert({
                    user_id: user.id,
                    tag: cleanTag,
                    label: label || undefined,
                })
                .select()
                .single();

            if (error) throw error;

            setTags([data, ...tags]);
            setNewTag('');
            setLabel('');
        } catch (error: any) {
            alert(`Erro: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveTag = async (id: string) => {
        try {
            const { error } = await supabase
                .from('player_tags')
                .delete()
                .eq('id', id);

            if (error) throw error;

            setTags(tags.filter(t => t.id !== id));
        } catch (error: any) {
            alert(`Erro: ${error.message}`);
        }
    };

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.push('/');
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900">
            {/* Header */}
            <header className="border-b border-gray-800">
                <div className="container mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                                <Trophy className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-xl font-bold text-white">CR Status</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="text-sm text-gray-400">{user.email}</span>
                            <button
                                onClick={handleSignOut}
                                className="flex items-center gap-2 px-4 py-2 text-gray-400 hover:text-white transition-colors"
                            >
                                <LogOut className="w-4 h-4" />
                                Sair
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="container mx-auto px-6 py-12">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-3xl font-bold text-white mb-8">Meus Jogadores</h1>

                    {/* Add Tag Form */}
                    <form onSubmit={handleAddTag} className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 mb-8">
                        <h2 className="text-lg font-semibold text-white mb-4">Adicionar Player Tag</h2>
                        <div className="grid md:grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Player Tag
                                </label>
                                <input
                                    type="text"
                                    value={newTag}
                                    onChange={(e) => setNewTag(e.target.value)}
                                    placeholder="#ABC123"
                                    className="w-full px-4 py-3 bg-gray-950 border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Apelido (opcional)
                                </label>
                                <input
                                    type="text"
                                    value={label}
                                    onChange={(e) => setLabel(e.target.value)}
                                    placeholder="Main, Conta Secundária..."
                                    className="w-full px-4 py-3 bg-gray-950 border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
                        >
                            <Plus className="w-5 h-5" />
                            Adicionar
                        </button>
                    </form>

                    {/* Player Tags List */}
                    <div className="space-y-4">
                        {tags.length === 0 ? (
                            <div className="bg-gray-900/30 border border-gray-800 rounded-2xl p-12 text-center">
                                <Trophy className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                                <h3 className="text-xl font-semibold text-white mb-2">Nenhum jogador adicionado</h3>
                                <p className="text-gray-400">Adicione sua primeira player tag acima para começar!</p>
                            </div>
                        ) : (
                            tags.map((tag) => (
                                <div
                                    key={tag.id}
                                    className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 flex items-center justify-between hover:border-gray-700 transition-colors"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-blue-600/10 rounded-lg flex items-center justify-center">
                                            <Trophy className="w-6 h-6 text-blue-500" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold text-white">
                                                {tag.label || `Player #${tag.tag}`}
                                            </h3>
                                            <p className="text-sm text-gray-400">#{tag.tag}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Link
                                            href={`/player/${tag.tag}`}
                                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                                        >
                                            Ver Perfil
                                        </Link>
                                        <button
                                            onClick={() => handleRemoveTag(tag.id)}
                                            className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
