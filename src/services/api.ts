import axios from 'axios';
import { Exercise } from '../types';

const API_NINJAS_KEY = 'YOUR_API_KEY'; // Users should get their own key from https://api-ninjas.com/
const DUMMY_JSON_API = 'https://dummyjson.com';

// Authentication API
export const authAPI = {
  login: async (username: string, password: string) => {
    const response = await axios.post(`${DUMMY_JSON_API}/auth/login`, {
      username,
      password,
    });
    return response.data;
  },

  // Mock register (DummyJSON doesn't have real registration)
  register: async (username: string, email: string, password: string) => {
    // Simulate API call
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

// Exercise API
export const exerciseAPI = {
  // Using a mock data since API Ninjas requires API key
  getExercises: async (muscle?: string): Promise<Exercise[]> => {
    // Mock exercises data for demo
    const mockExercises: Exercise[] = [
      {
        name: 'Push-ups',
        type: 'strength',
        muscle: 'chest',
        equipment: 'body_only',
        difficulty: 'beginner',
        instructions: 'Start in a high plank position. Lower your body until your chest nearly touches the floor. Push yourself back up.',
      },
      {
        name: 'Squats',
        type: 'strength',
        muscle: 'quadriceps',
        equipment: 'body_only',
        difficulty: 'beginner',
        instructions: 'Stand with feet shoulder-width apart. Lower your body as if sitting back into a chair. Return to standing.',
      },
      {
        name: 'Plank',
        type: 'strength',
        muscle: 'abdominals',
        equipment: 'body_only',
        difficulty: 'beginner',
        instructions: 'Hold a push-up position with your body in a straight line. Keep core engaged.',
      },
      {
        name: 'Lunges',
        type: 'strength',
        muscle: 'quadriceps',
        equipment: 'body_only',
        difficulty: 'beginner',
        instructions: 'Step forward with one leg, lowering your hips until both knees are bent at 90 degrees.',
      },
      {
        name: 'Burpees',
        type: 'cardio',
        muscle: 'full_body',
        equipment: 'body_only',
        difficulty: 'intermediate',
        instructions: 'Start standing, drop into a squat, kick feet back to plank, do a push-up, return to squat, jump up.',
      },
      {
        name: 'Mountain Climbers',
        type: 'cardio',
        muscle: 'abdominals',
        equipment: 'body_only',
        difficulty: 'intermediate',
        instructions: 'Start in a plank position. Alternate bringing knees to chest in a running motion.',
      },
      {
        name: 'Jumping Jacks',
        type: 'cardio',
        muscle: 'full_body',
        equipment: 'body_only',
        difficulty: 'beginner',
        instructions: 'Jump while spreading legs and raising arms overhead. Return to starting position.',
      },
      {
        name: 'Pull-ups',
        type: 'strength',
        muscle: 'lats',
        equipment: 'pull_up_bar',
        difficulty: 'advanced',
        instructions: 'Hang from a bar with palms facing away. Pull yourself up until chin is over the bar.',
      },
      {
        name: 'Bicycle Crunches',
        type: 'strength',
        muscle: 'abdominals',
        equipment: 'body_only',
        difficulty: 'intermediate',
        instructions: 'Lie on back, bring opposite elbow to knee while extending other leg. Alternate sides.',
      },
      {
        name: 'Deadlifts',
        type: 'strength',
        muscle: 'hamstrings',
        equipment: 'barbell',
        difficulty: 'advanced',
        instructions: 'Stand with feet hip-width. Bend at hips and knees to grip barbell. Lift by extending hips.',
      },
      {
        name: 'Bench Press',
        type: 'strength',
        muscle: 'chest',
        equipment: 'barbell',
        difficulty: 'intermediate',
        instructions: 'Lie on bench, lower barbell to chest, then press back up to starting position.',
      },
      {
        name: 'Running',
        type: 'cardio',
        muscle: 'full_body',
        equipment: 'none',
        difficulty: 'beginner',
        instructions: 'Maintain steady pace for cardiovascular fitness. Start with 20-30 minutes.',
      },
    ];

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockExercises);
      }, 800);
    });
  },
};
