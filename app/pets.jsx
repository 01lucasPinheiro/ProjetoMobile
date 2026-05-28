import { useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator, Alert, FlatList, RefreshControl,
  StyleSheet, Text, TouchableOpacity, View, Image,
} from 'react-native';
import { useAuth } from './_layout';
import { api } from '../services/api';
import { favoritesService } from '../services/favorites';

// Componente isolado PetCard
function PetCard({ pet, isFavorite, onToggleFavorite }) {
  const router = useRouter();

  function handlePress() {
    // Agora passamos o ID em vez do objeto inteiro
    router.push({ pathname: '/petDetails', params: { id: pet._id } });
  }

  return (
    <TouchableOpacity style={styles.card} onPress={handlePress}>
      <View style={styles.imagePlaceholder}>
        <Image source={{ uri: pet.images?.[0] }} style={styles.petImage} resizeMode="cover" />
        
        <TouchableOpacity style={styles.favoriteButton} onPress={() => onToggleFavorite(pet._id)}>
          <Text style={styles.favoriteText}>{isFavorite ? '❤️' : '🤍'}</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.petName}>{pet.name}</Text>
      <Text style={styles.petBreed}>{pet.breed}</Text>
    </TouchableOpacity>
  );
}

export default function PetsScreen() {
  const router = useRouter();
  const { token, setToken } = useAuth();
  
  const [pets, setPets] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchPetsAndFavorites = useCallback(async () => {
    try {
      const [petsData, favsData] = await Promise.all([
        api.getPets(token),
        favoritesService.getFavorites()
      ]);
      setPets(petsData);
      setFavorites(favsData);
    } catch (err) {
      Alert.alert('Erro', err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [token]);

  useEffect(() => { fetchPetsAndFavorites(); }, [fetchPetsAndFavorites]);

  async function handleToggleFavorite(petId) {
    const updatedFavs = await favoritesService.toggleFavorite(petId);
    setFavorites(updatedFavs);
  }

  function onRefresh() {
    setRefreshing(true);
    fetchPetsAndFavorites();
  }

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#E07B39" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={pets}
        keyExtractor={item => String(item._id)}
        renderItem={({ item }) => (
          <PetCard 
            pet={item} 
            isFavorite={favorites.includes(item._id)} 
            onToggleFavorite={handleToggleFavorite} 
          />
        )}
        contentContainerStyle={styles.list}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#E07B39']} />}
        ListEmptyComponent={
          <View style={styles.centered}>
            <Text style={styles.emptyText}>Nenhum pet encontrado.</Text>
          </View>
        }
      />

      <View style={styles.footer}>
        <TouchableOpacity style={styles.addButton} onPress={() => router.push('/createPet')}>
          <Text style={styles.addButtonText}>+ Cadastrar pet</Text>
        </TouchableOpacity>
        {/* Logout funcional consumindo do contexto */}
        <TouchableOpacity style={styles.logoutButton} onPress={() => setToken(null)}>
          <Text style={styles.logoutText}>Sair</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32 },
  emptyText: { color: '#666', fontSize: 16 },
  list: { padding: 16, paddingBottom: 100 },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 12, elevation: 2 },
  imagePlaceholder: { width: '100%', height: 180, borderRadius: 12, overflow: 'hidden', marginBottom: 12, backgroundColor: '#f1f1f1', position: 'relative' },
  petImage: { width: '100%', height: '100%' },
  favoriteButton: { position: 'absolute', top: 10, right: 10, backgroundColor: 'rgba(255,255,255,0.8)', padding: 8, borderRadius: 20 },
  favoriteText: { fontSize: 18 },
  petName: { fontSize: 18, fontWeight: '700', color: '#222' },
  petBreed: { fontSize: 14, color: '#777', marginTop: 4 },
  footer: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#eee', flexDirection: 'row', padding: 16, gap: 12 },
  addButton: { flex: 1, backgroundColor: '#E07B39', borderRadius: 8, paddingVertical: 13, alignItems: 'center' },
  addButtonText: { color: '#fff', fontWeight: '600', fontSize: 15 },
  logoutButton: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, paddingVertical: 13, paddingHorizontal: 18, alignItems: 'center' },
  logoutText: { color: '#666', fontSize: 15 },
});