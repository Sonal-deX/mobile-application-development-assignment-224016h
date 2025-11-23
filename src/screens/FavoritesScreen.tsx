import React, { useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Feather } from '@expo/vector-icons';
import { useAppDispatch, useAppSelector } from '../utils/hooks';
import { loadFavorites, removeFavorite } from '../store/favoritesSlice';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS } from '../constants/theme';
import { Exercise } from '../types';

export default function FavoritesScreen({ navigation }: any) {
  const dispatch = useAppDispatch();
  const favorites = useAppSelector((state) => state.favorites.favorites);
  const isDark = useAppSelector((state) => state.theme.isDark);
  const theme = isDark ? COLORS.dark : COLORS.light;

  useEffect(() => {
    loadFavoritesFromStorage();
  }, []);

  const loadFavoritesFromStorage = async () => {
    try {
      const storedFavorites = await AsyncStorage.getItem('favorites');
      if (storedFavorites) {
        dispatch(loadFavorites(JSON.parse(storedFavorites)));
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'beginner':
        return theme.success;
      case 'intermediate':
        return theme.warning;
      case 'advanced':
        return theme.error;
      default:
        return theme.textSecondary;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'cardio':
        return 'activity';
      case 'strength':
        return 'zap';
      default:
        return 'target';
    }
  };

  const handleRemoveFavorite = (name: string) => {
    dispatch(removeFavorite(name));
  };

  const renderFavoriteCard = ({ item }: { item: Exercise }) => (
    <View
      style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}
    >
      <TouchableOpacity
        style={styles.cardContent}
        onPress={() => navigation.navigate('Details', { exercise: item })}
        activeOpacity={0.7}
      >
        <View style={[styles.iconContainer, { backgroundColor: theme.primary + '20' }]}>
          <Feather name={getTypeIcon(item.type) as any} size={32} color={theme.primary} />
        </View>

        <View style={styles.info}>
          <Text style={[styles.cardTitle, { color: theme.text }]}>{item.name}</Text>
          <Text style={[styles.cardSubtitle, { color: theme.textSecondary }]} numberOfLines={1}>
            {item.muscle.charAt(0).toUpperCase() + item.muscle.slice(1)} • {item.equipment}
          </Text>

          <View style={styles.badgeContainer}>
            <View
              style={[
                styles.badge,
                { backgroundColor: getDifficultyColor(item.difficulty) + '20' },
              ]}
            >
              <Text
                style={[styles.badgeText, { color: getDifficultyColor(item.difficulty) }]}
              >
                {item.difficulty.toUpperCase()}
              </Text>
            </View>
            <View style={[styles.badge, { backgroundColor: theme.secondary + '20' }]}>
              <Text style={[styles.badgeText, { color: theme.secondary }]}>
                {item.type.toUpperCase()}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => handleRemoveFavorite(item.name)}
      >
        <Feather name="trash-2" size={20} color={theme.error} />
      </TouchableOpacity>
    </View>
  );

  if (favorites.length === 0) {
    return (
      <View style={[styles.emptyContainer, { backgroundColor: theme.background }]}>
        <Feather name="heart" size={64} color={theme.textSecondary} />
        <Text style={[styles.emptyTitle, { color: theme.text }]}>No Favorites Yet</Text>
        <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
          Start adding exercises to your favorites
        </Text>
        <TouchableOpacity
          style={[styles.exploreButton, { backgroundColor: theme.primary }]}
          onPress={() => navigation.navigate('Home')}
        >
          <Text style={styles.exploreButtonText}>Explore Exercises</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <FlatList
        data={favorites}
        renderItem={renderFavoriteCard}
        keyExtractor={(item, index) => `${item.name}-${index}`}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    padding: SPACING.md,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    marginBottom: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: BORDER_RADIUS.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  info: {
    flex: 1,
  },
  cardTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    marginBottom: SPACING.xs,
  },
  cardSubtitle: {
    fontSize: FONT_SIZES.sm,
    marginBottom: SPACING.sm,
  },
  badgeContainer: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  badge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.sm,
  },
  badgeText: {
    fontSize: FONT_SIZES.xs,
    fontWeight: '600',
  },
  deleteButton: {
    padding: SPACING.sm,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
  },
  emptyTitle: {
    fontSize: FONT_SIZES.xl,
    fontWeight: 'bold',
    marginTop: SPACING.lg,
  },
  emptyText: {
    fontSize: FONT_SIZES.md,
    marginTop: SPACING.sm,
    textAlign: 'center',
  },
  exploreButton: {
    marginTop: SPACING.xl,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
  },
  exploreButtonText: {
    color: '#FFFFFF',
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
  },
});
