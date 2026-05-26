import { Stack, useRouter, useSegments } from 'expo-router';
import { createContext, useContext, useState, useEffect } from 'react';

export const AuthContext = createContext(null);

export function useAuth() {
  return useContext(AuthContext);
}

export default function RootLayout() {
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    setIsLoading(false);
  }, []);

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
        <Stack.Screen name="pets" options={{ title: 'Pets disponíveis' }} />
        <Stack.Screen name="createPet" options={{ title: 'Cadastrar pet' }} />
        <Stack.Screen name="petDetails" options={{ title: 'Detalhes do pet' }} />
      </Stack>
    </AuthContext.Provider>
  );
}
