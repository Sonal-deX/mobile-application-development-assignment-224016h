import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAppDispatch, useAppSelector } from '../utils/hooks';
import { loadUser } from '../store/authSlice';
import { setTheme } from '../store/themeSlice';
import { loadFavorites } from '../store/favoritesSlice';
import { COLORS } from '../constants/theme';

// Screens
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import HomeScreen from '../screens/HomeScreen';
import DetailsScreen from '../screens/DetailsScreen';
import FavoritesScreen from '../screens/FavoritesScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  const isDark = useAppSelector((state) => Boolean(state.theme.isDark));
  const theme = isDark ? COLORS.dark : COLORS.light;
  const user = useAppSelector((state) => state.auth.user);

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.tabBarInactive,
        tabBarStyle: {
          backgroundColor: theme.tabBar,
          borderTopColor: theme.border,
        },
        headerStyle: {
          backgroundColor: theme.card,
        },
        headerTintColor: theme.text,
        headerTitleStyle: {
          fontWeight: '600',
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Feather name="home" size={size} color={color} />,
          headerRight: () => (
            <Feather
              name="user"
              size={24}
              color={theme.primary}
              style={{ marginRight: 16 }}
            />
          ),
          headerTitle: `Welcome, ${user?.firstName || 'User'}!`,
        }}
      />
      <Tab.Screen
        name="Favorites"
        component={FavoritesScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Feather name="heart" size={size} color={color} />,
          headerTitle: 'My Favorites',
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Feather name="user" size={size} color={color} />,
          headerTitle: 'Profile',
        }}
      />
    </Tab.Navigator>
  );
}

function AppNavigator() {
  const dispatch = useAppDispatch();
  const token = useAppSelector((state) => state.auth.token);
  const isDark = useAppSelector((state) => Boolean(state.theme.isDark));
  const theme = isDark ? COLORS.dark : COLORS.light;

  useEffect(() => {
    // Load persisted data
    const loadPersistedData = async () => {
      try {
        // Load auth
        await dispatch(loadUser());

        // Load theme
        const savedTheme = await AsyncStorage.getItem('theme');
        if (savedTheme) {
          dispatch(setTheme(savedTheme === 'dark'));
        }

        // Load favorites
        const savedFavorites = await AsyncStorage.getItem('favorites');
        if (savedFavorites) {
          dispatch(loadFavorites(JSON.parse(savedFavorites)));
        }
      } catch (error) {
        console.error('Error loading persisted data:', error);
      }
    };

    loadPersistedData();
  }, [dispatch]);

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: theme.card,
          },
          headerTintColor: theme.text,
          headerTitleStyle: {
            fontWeight: '600',
          },
        }}
      >
        {!token ? (
          <>
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Register"
              component={RegisterScreen}
              options={{
                title: 'Create Account',
              }}
            />
          </>
        ) : (
          <>
            <Stack.Screen
              name="MainTabs"
              component={MainTabs}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Details"
              component={DetailsScreen}
              options={{
                title: 'Exercise Details',
              }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default AppNavigator;
