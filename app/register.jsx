import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform, ScrollView,
  StyleSheet,
  Text, TextInput, TouchableOpacity
} from 'react-native';
import { api } from '../services/api';
import { useAuth } from './_layout';
const BASE_URL = 'https://petadopt.onrender.com';

export default function RegisterScreen({ navigation }) {
  const router = useRouter();
  const { setToken } = useAuth();
  const [form, setForm] = useState({
    name: '', email: '', phone: '', password: '', confirmpassword: '',
  });
  const [loading, setLoading] = useState(false);

  function set(field, value) {
    setForm(prev => ({ ...prev, [field]: value }));
  }

  async function handleRegister() {
    setLoading(true);
    try {
      const data = await api.register(form);
      setToken(data.token);
    } catch (err) {
      Alert.alert('Erro', err.message);
    } finally {
      setLoading(false);
    }
  }
  const fields = [
    { key: 'name', placeholder: 'Nome completo' },
    { key: 'email', placeholder: 'E-mail', autoCapitalize: 'none', keyboardType: 'email-address' },
    { key: 'phone', placeholder: 'Telefone', keyboardType: 'phone-pad' },
    { key: 'password', placeholder: 'Senha', secureTextEntry: true },
    { key: 'confirmpassword', placeholder: 'Confirmar senha', secureTextEntry: true },
  ];

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: '#fff' }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.heading}>Crie sua conta</Text>

        {fields.map(f => (
          <TextInput
            key={f.key}
            style={styles.input}
            placeholder={f.placeholder}
            autoCapitalize={f.autoCapitalize || 'sentences'}
            keyboardType={f.keyboardType || 'default'}
            secureTextEntry={f.secureTextEntry || false}
            value={form[f.key]}
            onChangeText={v => set(f.key, v)}
          />
        ))}

        <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Cadastrar</Text>}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.replace('/')}>
          <Text style={styles.link}>Já tem conta? <Text style={styles.linkBold}>Entrar</Text></Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 28,
    paddingVertical: 40,
  },
  heading: {
    fontSize: 24,
    fontWeight: '700',
    color: '#222',
    marginBottom: 28,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    marginBottom: 14,
    backgroundColor: '#fafafa',
  },
  button: {
    backgroundColor: '#E07B39',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 4,
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  link: {
    textAlign: 'center',
    color: '#888',
    fontSize: 14,
  },
  linkBold: {
    color: '#E07B39',
    fontWeight: '600',
  },
});