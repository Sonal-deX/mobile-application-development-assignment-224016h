import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FavoritesState, Exercise } from '../types';

const initialState: FavoritesState = {
  favorites: [],
};

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    addFavorite: (state, action: PayloadAction<Exercise>) => {
      if (!state.favorites.find((ex) => ex.name === action.payload.name)) {
        state.favorites.push(action.payload);
        AsyncStorage.setItem('favorites', JSON.stringify(state.favorites));
      }
    },
    removeFavorite: (state, action: PayloadAction<string>) => {
      state.favorites = state.favorites.filter((ex) => ex.name !== action.payload);
      AsyncStorage.setItem('favorites', JSON.stringify(state.favorites));
    },
    loadFavorites: (state, action: PayloadAction<Exercise[]>) => {
      state.favorites = action.payload;
    },
  },
});

export const { addFavorite, removeFavorite, loadFavorites } = favoritesSlice.actions;
export default favoritesSlice.reducer;
