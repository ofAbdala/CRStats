import { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import type { PlayerTag } from '@crstatus/shared';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
    },
});

export default function Players() {
    const [loading, setLoading] = useState(true);
    const [tags, setTags] = useState<PlayerTag[]>([]);
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                router.replace('/login');
                return;
            }

            setUser(user);

            const { data } = await supabase
                .from('player_tags')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });

            setTags(data || []);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.replace('/');
    };

    if (loading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#2563EB" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <StatusBar style="light" />

            <View style={styles.header}>
                <View>
                    <Text style={styles.headerTitle}>Meus Jogadores</Text>
                    <Text style={styles.headerSubtitle}>{user?.email}</Text>
                </View>
                <TouchableOpacity onPress={handleSignOut}>
                    <Text style={styles.signOutText}>Sair</Text>
                </TouchableOpacity>
            </View>

            {tags.length === 0 ? (
                <View style={styles.empty}>
                    <Text style={styles.emptyEmoji}>🏆</Text>
                    <Text style={styles.emptyTitle}>Nenhum jogador adicionado</Text>
                    <Text style={styles.emptyDesc}>
                        Adicione sua primeira player tag para começar!
                    </Text>
                </View>
            ) : (
                <FlatList
                    data={tags}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.list}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={styles.card}
                            onPress={() => router.push(`/player/${item.tag}`)}
                        >
                            <View style={styles.cardIcon}>
                                <Text style={styles.cardIconText}>🏆</Text>
                            </View>
                            <View style={styles.cardContent}>
                                <Text style={styles.cardTitle}>
                                    {item.label || `Player #${item.tag}`}
                                </Text>
                                <Text style={styles.cardTag}>#{item.tag}</Text>
                            </View>
                            <Text style={styles.cardArrow}>→</Text>
                        </TouchableOpacity>
                    )}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 24,
        paddingTop: 60,
        borderBottomWidth: 1,
        borderBottomColor: '#1F2937',
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFF',
    },
    headerSubtitle: {
        fontSize: 12,
        color: '#9CA3AF',
        marginTop: 4,
    },
    signOutText: {
        color: '#9CA3AF',
        fontSize: 14,
    },
    list: {
        padding: 16,
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#111',
        borderWidth: 1,
        borderColor: '#1F2937',
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
    },
    cardIcon: {
        width: 48,
        height: 48,
        backgroundColor: '#1E3A8A',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    cardIconText: {
        fontSize: 24,
    },
    cardContent: {
        flex: 1,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FFF',
        marginBottom: 2,
    },
    cardTag: {
        fontSize: 12,
        color: '#9CA3AF',
    },
    cardArrow: {
        fontSize: 20,
        color: '#9CA3AF',
    },
    empty: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 48,
    },
    emptyEmoji: {
        fontSize: 64,
        marginBottom: 16,
    },
    emptyTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#FFF',
        marginBottom: 8,
    },
    emptyDesc: {
        fontSize: 14,
        color: '#9CA3AF',
        textAlign: 'center',
    },
});
