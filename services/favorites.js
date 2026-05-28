import AsyncStorage from '@react-native-async-storage/async-storage';

const FAV_KEY = '@petadopt_favorites';

export const favoritesService = {
  getFavorites: async () => {
    try {
      const data = await AsyncStorage.getItem(FAV_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  toggleFavorite: async (petId) => {
    try {
      const favorites = await favoritesService.getFavorites();
      const isFav = favorites.includes(petId);
      
      let newFavorites;
      if (isFav) {
        newFavorites = favorites.filter(id => id !== petId); // Remove
      } else {
        newFavorites = [...favorites, petId]; // Adiciona
      }
      
      await AsyncStorage.setItem(FAV_KEY, JSON.stringify(newFavorites));
      return newFavorites;
    } catch (err) {
      console.error('Erro ao favoritar', err);
      return [];
    }
  }
};