import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function Index() {
    return (
        <View style={styles.container}>
            <StatusBar style="light" />

            <View style={styles.hero}>
                <View style={styles.iconContainer}>
                    <Text style={styles.iconText}>🏆</Text>
                </View>
                <Text style={styles.title}>CR Status</Text>
                <Text style={styles.subtitle}>
                    Acompanhe seu desempenho no Clash Royale com analytics avançados
                </Text>

                <Link href="/login" asChild>
                    <TouchableOpacity style={styles.button}>
                        <Text style={styles.buttonText}>Começar Agora</Text>
                    </TouchableOpacity>
                </Link>
            </View>

            <View style={styles.features}>
                <FeatureCard
                    emoji="⚡"
                    title="Push Sessions"
                    description="Detecção automática de sessões"
                />
                <FeatureCard
                    emoji="🎯"
                    title="Metas"
                    description="Defina e acompanhe objetivos"
                />
                <FeatureCard
                    emoji="📊"
                    title="Analytics"
                    description="Visualize seu progresso"
                />
            </View>
        </View>
    );
}

function FeatureCard({ emoji, title, description }: { emoji: string; title: string; description: string }) {
    return (
        <View style={styles.featureCard}>
            <Text style={styles.featureEmoji}>{emoji}</Text>
            <Text style={styles.featureTitle}>{title}</Text>
            <Text style={styles.featureDesc}>{description}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    hero: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    iconContainer: {
        width: 80,
        height: 80,
        backgroundColor: '#1E40AF',
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
    },
    iconText: {
        fontSize: 40,
    },
    title: {
        fontSize: 48,
        fontWeight: 'bold',
        color: '#FFF',
        marginBottom: 12,
    },
    subtitle: {
        fontSize: 18,
        color: '#9CA3AF',
        textAlign: 'center',
        marginBottom: 32,
        paddingHorizontal: 20,
    },
    button: {
        backgroundColor: '#2563EB',
        paddingHorizontal: 32,
        paddingVertical: 16,
        borderRadius: 12,
    },
    buttonText: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: '600',
    },
    features: {
        padding: 24,
        paddingBottom: 48,
    },
    featureCard: {
        backgroundColor: '#111',
        padding: 20,
        borderRadius: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#222',
    },
    featureEmoji: {
        fontSize: 32,
        marginBottom: 8,
    },
    featureTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#FFF',
        marginBottom: 4,
    },
    featureDesc: {
        fontSize: 14,
        color: '#9CA3AF',
    },
});
