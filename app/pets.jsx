import { useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator, Alert,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
} from 'react-native';
import { useAuth } from './_layout';

const BASE_URL = 'https://petadopt.onrender.com';

function PetCard({ pet }) {
  const router = useRouter();

  function handlePress() {
    router.push({
      pathname: '/petDetails',
      params: {
        pet: JSON.stringify(pet),
      },
    });
  }

  return (
    <TouchableOpacity style={styles.card} onPress={handlePress}>
      <View style={styles.imagePlaceholder}>
        <Image
          source={{ uri: pet.images[0] }}
          style={styles.petImage}
          resizeMode="cover"
        />
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
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
  },

  imagePlaceholder: {
    width: '100%',
    height: 180,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 12,
    backgroundColor: '#f1f1f1',
  },

  petImage: {
    width: '100%',
    height: '100%',
  },

  petName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#222',
  },

  petBreed: {
    fontSize: 14,
    color: '#777',
    marginTop: 4,
  },
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