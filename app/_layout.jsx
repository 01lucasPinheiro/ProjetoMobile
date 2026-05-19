import { Stack, useRouter, useSegments } from 'expo-router';
import { createContext, useContext, useState, useEffect } from 'react';

export const AuthContext = createContext(null);

export function useAuth() {
  return useContext(AuthContext);
}

export default function RootLayout() {
  const [token, setToken] = useState(null);
  const segments = useSegments();
  const router = useRouter();

  // Proteção de rotas: redireciona baseado no token
  useEffect(() => {
    const inAuthGroup = segments[0] === 'pets' || segments[0] === 'createPet';

    if (!token && inAuthGroup) {
      // Se não tem token e tentou acessar área logada, vai para o Login
      router.replace('/');
    } else if (token && !inAuthGroup) {
      // Se tem token e está na tela de login/cadastro, vai para os Pets
      router.replace('/pets');
    }
  }, [token, segments]);

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
      </Stack>
    </AuthContext.Provider>
  );
}
