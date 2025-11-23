import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeState } from '../types';

const initialState: ThemeState = {
  isDark: false,
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.isDark = !state.isDark;
      AsyncStorage.setItem('theme', state.isDark ? 'dark' : 'light');
    },
    setTheme: (state, action: PayloadAction<boolean>) => {
      // Ensure payload is always a boolean
      state.isDark = Boolean(action.payload);
      AsyncStorage.setItem('theme', state.isDark ? 'dark' : 'light');
    },
  },
});

export const { toggleTheme, setTheme } = themeSlice.actions;
export default themeSlice.reducer;
