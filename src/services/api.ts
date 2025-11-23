import axios from 'axios';
import { Exercise } from '../types';

const DUMMY_JSON_API = 'https://dummyjson.com';
const API_NINJAS_KEY = 'HH5p+pLRkDSFRkwBuri4ow==5U7qNmSofCmuNnY7';
const API_NINJAS_BASE = 'https://api.api-ninjas.com/v1';

export const authAPI = {
  login: async (username: string, password: string) => {
    const response = await axios.post(`${DUMMY_JSON_API}/auth/login`, {
      username,
      password,
      expiresInMins: 30,
    });
    
    const data = response.data;
    return {
      ...data,
      token: data.accessToken || data.token,
    };
  },

  register: async (username: string, email: string, password: string) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: Math.floor(Math.random() * 1000),
          username,
          email,
          firstName: username,
          lastName: 'User',
          token: 'mock-token-' + Date.now(),
        });
      }, 1000);
    });
  },
};

export const exerciseAPI = {
  getExercises: async (muscle?: string): Promise<Exercise[]> => {
    try {
      const muscles = ['chest', 'biceps', 'quadriceps', 'abdominals', 'triceps', 'lats'];
      const allExercises: Exercise[] = [];

      for (const targetMuscle of muscles) {
        const response = await axios.get(`${API_NINJAS_BASE}/exercises`, {
          params: {
            muscle: targetMuscle,
            offset: 0,
          },
          headers: {
            'X-Api-Key': API_NINJAS_KEY,
          },
        });

        if (response.data && Array.isArray(response.data)) {
          const exercises = response.data.slice(0, 2).map((exercise: any) => ({
            name: exercise.name,
            type: exercise.type,
            muscle: exercise.muscle,
            equipment: exercise.equipment,
            difficulty: exercise.difficulty,
            instructions: exercise.instructions,
          }));
          allExercises.push(...exercises);
        }
      }

      return allExercises;
    } catch (error) {
      console.error('Error fetching from API Ninjas:', error);
      return [];
    }
  },
};

