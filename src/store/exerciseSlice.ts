import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { ExerciseState, Exercise } from '../types';
import { exerciseAPI } from '../services/api';

const initialState: ExerciseState = {
  exercises: [],
  isLoading: false,
  error: null,
};

export const fetchExercises = createAsyncThunk(
  'exercises/fetch',
  async (_: void, { rejectWithValue }) => {
    try {
      const data = await exerciseAPI.getExercises();
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch exercises');
    }
  }
);

const exerciseSlice = createSlice({
  name: 'exercises',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchExercises.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchExercises.fulfilled, (state, action: PayloadAction<Exercise[]>) => {
        state.isLoading = false;
        state.exercises = action.payload;
      })
      .addCase(fetchExercises.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = exerciseSlice.actions;
export default exerciseSlice.reducer;
