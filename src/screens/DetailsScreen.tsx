import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useAppDispatch, useAppSelector } from '../utils/hooks';
import { addFavorite, removeFavorite } from '../store/favoritesSlice';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS } from '../constants/theme';
import { Exercise } from '../types';

export default function DetailsScreen({ route, navigation }: any) {
  const { exercise } = route.params as { exercise: Exercise };
  const dispatch = useAppDispatch();
  const favorites = useAppSelector((state) => state.favorites.favorites);
  const isDark = useAppSelector((state) => Boolean(state.theme.isDark));
  const theme = isDark ? COLORS.dark : COLORS.light;

  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    setIsFavorite(favorites.some((fav) => fav.name === exercise.name));
  }, [favorites, exercise]);

  const handleToggleFavorite = () => {
    if (isFavorite) {
      dispatch(removeFavorite(exercise.name));
      Alert.alert('Removed', 'Exercise removed from favorites');
    } else {
      dispatch(addFavorite(exercise));
      Alert.alert('Added', 'Exercise added to favorites');
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

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header Section */}
        <View style={[styles.header, { backgroundColor: theme.card }]}>
          <View style={[styles.iconContainer, { backgroundColor: theme.primary + '20' }]}>
            <Feather name={getTypeIcon(exercise.type) as any} size={48} color={theme.primary} />
          </View>
          <Text style={[styles.title, { color: theme.text }]}>{exercise.name}</Text>
          
          <View style={styles.badgeRow}>
            <View
              style={[
                styles.badge,
                { backgroundColor: getDifficultyColor(exercise.difficulty) + '20' },
              ]}
            >
              <Text
                style={[styles.badgeText, { color: getDifficultyColor(exercise.difficulty) }]}
              >
                {exercise.difficulty.toUpperCase()}
              </Text>
            </View>
            <View style={[styles.badge, { backgroundColor: theme.secondary + '20' }]}>
              <Text style={[styles.badgeText, { color: theme.secondary }]}>
                {exercise.type.toUpperCase()}
              </Text>
            </View>
          </View>
        </View>

        {/* Info Cards */}
        <View style={styles.infoSection}>
          <View style={[styles.infoCard, { backgroundColor: theme.card }]}>
            <Feather name="target" size={24} color={theme.primary} />
            <View style={styles.infoContent}>
              <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>
                Target Muscle
              </Text>
              <Text style={[styles.infoValue, { color: theme.text }]}>
                {exercise.muscle.charAt(0).toUpperCase() + exercise.muscle.slice(1)}
              </Text>
            </View>
          </View>

          <View style={[styles.infoCard, { backgroundColor: theme.card }]}>
            <Feather name="tool" size={24} color={theme.primary} />
            <View style={styles.infoContent}>
              <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>Equipment</Text>
              <Text style={[styles.infoValue, { color: theme.text }]}>
                {exercise.equipment.replace(/_/g, ' ').toUpperCase()}
              </Text>
            </View>
          </View>
        </View>

        {/* Instructions */}
        <View style={[styles.section, { backgroundColor: theme.card }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            <Feather name="list" size={20} color={theme.primary} /> Instructions
          </Text>
          <Text style={[styles.instructions, { color: theme.textSecondary }]}>
            {exercise.instructions}
          </Text>
        </View>

        {/* Tips Section */}
        <View style={[styles.section, { backgroundColor: theme.card }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            <Feather name="info" size={20} color={theme.primary} /> Pro Tips
          </Text>
          <View style={styles.tipItem}>
            <Feather name="check-circle" size={16} color={theme.success} />
            <Text style={[styles.tipText, { color: theme.textSecondary }]}>
              Warm up properly before starting
            </Text>
          </View>
          <View style={styles.tipItem}>
            <Feather name="check-circle" size={16} color={theme.success} />
            <Text style={[styles.tipText, { color: theme.textSecondary }]}>
              Focus on proper form over speed
            </Text>
          </View>
          <View style={styles.tipItem}>
            <Feather name="check-circle" size={16} color={theme.success} />
            <Text style={[styles.tipText, { color: theme.textSecondary }]}>
              Stay hydrated during workout
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Favorite Button */}
      <TouchableOpacity
        style={[styles.favoriteButton, { backgroundColor: theme.primary }]}
        onPress={handleToggleFavorite}
      >
        <Feather name={isFavorite ? 'heart' : 'heart'} size={24} color="#FFFFFF" fill={isFavorite ? '#FFFFFF' : 'transparent'} />
        <Text style={styles.favoriteButtonText}>
          {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  header: {
    alignItems: 'center',
    padding: SPACING.xl,
  },
  iconContainer: {
    width: 96,
    height: 96,
    borderRadius: BORDER_RADIUS.xl,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  title: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: SPACING.md,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  badge: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
  },
  badgeText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
  },
  infoSection: {
    flexDirection: 'row',
    padding: SPACING.md,
    gap: SPACING.md,
  },
  infoCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoContent: {
    marginLeft: SPACING.sm,
    flex: 1,
  },
  infoLabel: {
    fontSize: FONT_SIZES.xs,
    marginBottom: SPACING.xs,
  },
  infoValue: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
  },
  section: {
    margin: SPACING.md,
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    marginBottom: SPACING.md,
  },
  instructions: {
    fontSize: FONT_SIZES.md,
    lineHeight: 24,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  tipText: {
    fontSize: FONT_SIZES.md,
    marginLeft: SPACING.sm,
    flex: 1,
  },
  favoriteButton: {
    position: 'absolute',
    bottom: SPACING.lg,
    left: SPACING.lg,
    right: SPACING.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  favoriteButtonText: {
    color: '#FFFFFF',
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    marginLeft: SPACING.sm,
  },
});
