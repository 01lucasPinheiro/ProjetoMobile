import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import {
    ActivityIndicator, Alert,
    FlatList,
    RefreshControl,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useAuth } from './_layout';

const BASE_URL = 'https://petadopt.onrender.com';

function PetCard({ pet }) {
  const router = useRouter();
  const genderLabel = pet.gender === 'male' ? '♂ Macho' : '♀ Fêmea';
  const statusColor = pet.available ? '#4CAF50' : '#999';
  const statusLabel = pet.available ? 'Disponível' : 'Adotado';

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.petName}>{pet.name}</Text>
        <View style={[styles.badge, { backgroundColor: statusColor }]}>
          <Text style={styles.badgeText}>{statusLabel}</Text>
        </View>
      </View>
      <Text style={styles.petBreed}>{pet.breed} · {genderLabel}</Text>
      <View style={styles.row}>
        <Text style={styles.detail}>🎂 {pet.age} anos</Text>
        <Text style={styles.detail}>⚖️ {pet.weight} kg</Text>
        <Text style={styles.detail}>🎨 {pet.color}</Text>
      </View>
      {pet.story ? <Text style={styles.story} numberOfLines={2}>{pet.story}</Text> : null}
    </View>
  );
}

export default function PetsScreen({ navigation }) {
  const { token, setToken } = useAuth();
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchPets = useCallback(async () => {
    try {
      const res = await fetch(`${BASE_URL}/pet/pets`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Erro ao buscar pets');
      setPets(Array.isArray(data) ? data : data.pets || []);
    } catch (err) {
      Alert.alert('Erro', err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [token]);

  useEffect(() => { fetchPets(); }, [fetchPets]);

  function onRefresh() {
    setRefreshing(true);
    fetchPets();
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
        keyExtractor={item => item._id}
        renderItem={({ item }) => <PetCard pet={item} />}
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
  list: { padding: 16, paddingBottom: 100 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  petName: { fontSize: 18, fontWeight: '700', color: '#222' },
  badge: {
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  badgeText: { color: '#fff', fontSize: 12, fontWeight: '600' },
  petBreed: { color: '#666', fontSize: 14, marginBottom: 8 },
  row: { flexDirection: 'row', gap: 12, marginBottom: 8 },
  detail: { fontSize: 13, color: '#555' },
  story: { fontSize: 13, color: '#888', fontStyle: 'italic' },
  emptyText: { color: '#999', fontSize: 16 },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  addButton: {
    flex: 1,
    backgroundColor: '#E07B39',
    borderRadius: 8,
    paddingVertical: 13,
    alignItems: 'center',
  },
  addButtonText: { color: '#fff', fontWeight: '600', fontSize: 15 },
  logoutButton: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingVertical: 13,
    paddingHorizontal: 18,
    alignItems: 'center',
  },
  logoutText: { color: '#666', fontSize: 15 },
});