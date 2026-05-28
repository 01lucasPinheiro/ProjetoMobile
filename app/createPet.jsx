import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView, Platform,
  ScrollView,
  StyleSheet,
  Text, TextInput, TouchableOpacity,
  View,
} from 'react-native';
import { useAuth } from './_layout';
import { api } from '../services/api';
const BASE_URL = 'https://petadopt.onrender.com'

export default function CreatePetScreen({ navigation, route }) {
  const { token } = useAuth();
  const { onCreated } = route?.params || {};

  const [form, setForm] = useState({
    name: '', breed: '', gender: 'male', age: '',
    weight: '', color: '', story: '', available: true, category: '',
  });
  const [categories, setCategories] = useState([]);
  const [loadingCats, setLoadingCats] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const list = await api.getCategories(token);
        setCategories(list);
        if (list.length > 0) setForm(prev => ({ ...prev, category: list[0]._id }));
      } catch {
        Alert.alert('Erro', 'Não foi possível carregar as categorias.');
      } finally { setLoadingCats(false); }
    }
    fetchCategories();
  }, [token]);

  function set(field, value) {
    setForm(prev => ({ ...prev, [field]: value }));
  }

  async function handleCreate() {
    const { name, breed, gender, age, weight, color, story, available, category } = form;
    if (!name || !breed || !age || !weight || !color || !category) {
      Alert.alert('Atenção', 'Preencha todos os campos obrigatórios.');
      return;
    }
    setLoading(true);
    try {
      await api.createPet({ 
        name, breed, gender, age: Number(age), weight: Number(weight), 
        color, story, available, category 
      }, token);
      
      Alert.alert('Sucesso', 'Pet cadastrado!', [
        { text: 'OK', onPress: () => { onCreated?.(); navigation.goBack(); } },
      ]);
    } catch (err) {
      Alert.alert('Erro', err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: '#fff' }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">

        <Field label="Nome *" value={form.name} onChangeText={v => set('name', v)} placeholder="Ex: Bolinha" />
        <Field label="Raça *" value={form.breed} onChangeText={v => set('breed', v)} placeholder="Ex: Vira-lata" />
        <Field label="Cor *" value={form.color} onChangeText={v => set('color', v)} placeholder="Ex: Caramelo" />
        <Field label="Idade (anos) *" value={form.age} onChangeText={v => set('age', v)} placeholder="Ex: 3" keyboardType="numeric" />
        <Field label="Peso (kg) *" value={form.weight} onChangeText={v => set('weight', v)} placeholder="Ex: 8" keyboardType="numeric" />
        <Field label="História" value={form.story} onChangeText={v => set('story', v)} placeholder="Conte um pouco sobre o pet..." multiline />

        {/* Gênero */}
        <Text style={styles.label}>Gênero</Text>
        <View style={styles.toggleRow}>
          {['male', 'female'].map(g => (
            <TouchableOpacity
              key={g}
              style={[styles.toggleBtn, form.gender === g && styles.toggleBtnActive]}
              onPress={() => set('gender', g)}
            >
              <Text style={[styles.toggleText, form.gender === g && styles.toggleTextActive]}>
                {g === 'male' ? '♂ Macho' : '♀ Fêmea'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Disponível */}
        <Text style={styles.label}>Disponível para adoção</Text>
        <View style={styles.toggleRow}>
          {[true, false].map(v => (
            <TouchableOpacity
              key={String(v)}
              style={[styles.toggleBtn, form.available === v && styles.toggleBtnActive]}
              onPress={() => set('available', v)}
            >
              <Text style={[styles.toggleText, form.available === v && styles.toggleTextActive]}>
                {v ? 'Sim' : 'Não'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Categoria */}
        <Text style={styles.label}>Categoria *</Text>
        {loadingCats ? (
          <ActivityIndicator color="#E07B39" style={{ marginBottom: 16 }} />
        ) : categories.length > 0 ? (
          <View style={styles.catRow}>
            {categories.map(cat => (
              <TouchableOpacity
                key={cat._id}
                style={[styles.catBtn, form.category === cat._id && styles.catBtnActive]}
                onPress={() => set('category', cat._id)}
              >
                <Text style={[styles.catText, form.category === cat._id && styles.catTextActive]}>
                  {cat.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          <Field label="" value={form.category} onChangeText={v => set('category', v)} placeholder="ID da categoria" />
        )}

        <TouchableOpacity style={styles.button} onPress={handleCreate} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Cadastrar pet</Text>}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function Field({ label, ...props }) {
  return (
    <View style={{ marginBottom: 14 }}>
      {label ? <Text style={fieldStyles.label}>{label}</Text> : null}
      <TextInput
        style={[fieldStyles.input, props.multiline && { height: 80, textAlignVertical: 'top' }]}
        placeholderTextColor="#aaa"
        {...props}
      />
    </View>
  );
}

const fieldStyles = StyleSheet.create({
  label: { fontSize: 13, color: '#555', marginBottom: 5, fontWeight: '500' },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 11,
    fontSize: 15,
    backgroundColor: '#fafafa',
  },
});

const styles = StyleSheet.create({
  container: { padding: 20, paddingBottom: 40 },
  label: { fontSize: 13, color: '#555', marginBottom: 8, fontWeight: '500' },
  toggleRow: { flexDirection: 'row', gap: 10, marginBottom: 18 },
  toggleBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingVertical: 11,
    alignItems: 'center',
    backgroundColor: '#fafafa',
  },
  toggleBtnActive: { backgroundColor: '#E07B39', borderColor: '#E07B39' },
  toggleText: { color: '#666', fontWeight: '500' },
  toggleTextActive: { color: '#fff' },
  catRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 18 },
  catBtn: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
    paddingVertical: 7,
    paddingHorizontal: 16,
    backgroundColor: '#fafafa',
  },
  catBtnActive: { backgroundColor: '#E07B39', borderColor: '#E07B39' },
  catText: { fontSize: 14, color: '#666' },
  catTextActive: { color: '#fff', fontWeight: '500' },
  button: {
    backgroundColor: '#E07B39',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: { color: '#fff', fontWeight: '600', fontSize: 16 },
});