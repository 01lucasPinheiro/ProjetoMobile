const BASE_URL = 'https://petadopt.onrender.com';

export const api = {
  login: async (email, password) => {
    const res = await fetch(`${BASE_URL}/user/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Erro ao fazer login');
    return data;
  },

  register: async (userData) => {
    const res = await fetch(`${BASE_URL}/user/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Erro ao cadastrar');
    return data;
  },

  getPets: async (token) => {
    const res = await fetch(`${BASE_URL}/pet/pets`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Erro ao buscar pets');
    return Array.isArray(data) ? data : data.pets || [];
  },

  getPetById: async (id, token) => {
    const res = await fetch(`${BASE_URL}/pet/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Erro ao buscar detalhes do pet');
    return data.pet || data; 
  },

  getCategories: async (token) => {
    const res = await fetch(`${BASE_URL}/pet/category`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (!res.ok) throw new Error('Erro ao carregar categorias');
    return Array.isArray(data) ? data : data.categories || [];
  },

  createPet: async (petData, token) => {
    const res = await fetch(`${BASE_URL}/pet/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(petData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Erro ao cadastrar pet');
    return data;
  }
};