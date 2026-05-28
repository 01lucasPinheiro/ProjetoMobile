import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View, Image, ActivityIndicator, Alert } from 'react-native';
import { useAuth } from './_layout';
import { api } from '../services/api';

export default function PetDetails() {
    const router = useRouter();
    const { token } = useAuth();
    const { id } = useLocalSearchParams(); // Agora recebemos o ID
    
    const [pet, setPet] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadPetDetails() {
            try {
                const data = await api.getPetById(id, token);
                setPet(data);
            } catch (err) {
                Alert.alert('Erro', err.message);
                router.back();
            } finally {
                setLoading(false);
            }
        }
        if (id) loadPetDetails();
    }, [id, token]);

    if (loading) {
        return (
            <View style={[styles.container, styles.centered]}>
                <ActivityIndicator size="large" color="#E07B39" />
            </View>
        );
    }

    if (!pet) return null;

    const genderLabel = pet.gender === 'male' ? '♂ Macho' : '♀ Fêmea';
    const statusLabel = pet.available ? 'Disponível' : 'Adotado';

    return (
        <ScrollView style={styles.container}>
            <View style={styles.imageContainer}>
                <Image source={{ uri: pet.images?.[0] }} style={styles.petImage} resizeMode="cover" />
            </View>

            <View style={styles.content}>
                <Text style={styles.name}>{pet.name}</Text>
                <Text style={styles.breed}>{pet.breed}</Text>

                <View style={styles.infoBox}>
                    <Text style={styles.info}>Sexo: {genderLabel}</Text>
                    <Text style={styles.info}>Idade: {pet.age} anos</Text>
                    <Text style={styles.info}>Peso: {pet.weight} kg</Text>
                    <Text style={styles.info}>Cor: {pet.color}</Text>
                    <Text style={styles.info}>Status: {statusLabel}</Text>
                </View>

                {pet.story ? (
                    <>
                        <Text style={styles.sectionTitle}>História</Text>
                        <Text style={styles.story}>{pet.story}</Text>
                    </>
                ) : null}

                <TouchableOpacity style={styles.button} onPress={() => router.back()}>
                    <Text style={styles.buttonText}>Voltar</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    centered: { justifyContent: 'center', alignItems: 'center' },
    imageContainer: { height: 300, backgroundColor: '#f5f5f5', overflow: 'hidden' },
    petImage: { width: '100%', height: '100%' },
    content: { padding: 20 },
    name: { fontSize: 28, fontWeight: '700', color: '#222' },
    breed: { fontSize: 18, color: '#777', marginBottom: 20 },
    infoBox: { backgroundColor: '#fafafa', borderRadius: 12, padding: 16, marginBottom: 20, gap: 8 },
    info: { fontSize: 16, color: '#444' },
    sectionTitle: { fontSize: 20, fontWeight: '600', marginBottom: 10 },
    story: { color: '#666', lineHeight: 22, marginBottom: 20 },
    button: { backgroundColor: '#E07B39', borderRadius: 8, paddingVertical: 14, alignItems: 'center' },
    buttonText: { color: '#fff', fontWeight: '600', fontSize: 16 },
});