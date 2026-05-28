import AsyncStorage from '@react-native-async-storage/async-storage';
import { Stack, useRouter, useSegments } from 'expo-router';
import { createContext, useContext, useState, useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';

export const AuthContext = createContext(null);

export function useAuth() {
  return useContext(AuthContext);
}

export default function RootLayout() {
  const [token, setTokenState] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const segments = useSegments();
  const router = useRouter();

  // Carrega a sessão salva ao iniciar o app (Splash)
  useEffect(() => {
    async function loadSession() {
      try {
        const storedToken = await AsyncStorage.getItem('@petadopt_token');
        if (storedToken) setTokenState(storedToken);
      } catch (e) {
        console.error('Erro ao ler token', e);
      } finally {
        setIsLoading(false);
      }
    }
    loadSession();
  }, []);

  // Controle de navegação e acesso
  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === 'pets' || segments[0] === 'createPet' || segments[0] === 'petDetails';

    const navigationTimeout = setTimeout(() => {
      if (!token && inAuthGroup) {
        router.replace('/');
      } else if (token && !inAuthGroup) {
        router.replace('/pets');
      }
    }, 0);

    return () => clearTimeout(navigationTimeout);
  }, [token, segments, isLoading]);

  // Função para logar e deslogar persistindo no dispositivo
  const setToken = async (newToken) => {
    setTokenState(newToken);
    if (newToken) {
      await AsyncStorage.setItem('@petadopt_token', newToken);
    } else {
      await AsyncStorage.removeItem('@petadopt_token');
    }
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
        <ActivityIndicator size="large" color="#E07B39" />
      </View>
    );
  }

  return (
    <AuthContext.Provider value={{ token, setToken }}>
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: '#fff' },
          headerTintColor: '#222',
          headerTitleStyle: { fontWeight: '600' },
        }}
      >
        <Stack.Screen name="index" options={{ title: 'Entrar' }} />
        <Stack.Screen name="register" options={{ title: 'Criar conta' }} />
        <Stack.Screen name="pets" options={{ title: 'Pets disponíveis', headerLeft: () => null }} />
        <Stack.Screen name="createPet" options={{ title: 'Cadastrar pet' }} />
        <Stack.Screen name="petDetails" options={{ title: 'Detalhes do pet' }} />
      </Stack>
    </AuthContext.Provider>
  );
}