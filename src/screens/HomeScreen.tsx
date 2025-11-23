import React, { useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useAppDispatch, useAppSelector } from '../utils/hooks';
import { fetchExercises } from '../store/exerciseSlice';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS } from '../constants/theme';
import { Exercise } from '../types';

export default function HomeScreen({ navigation }: any) {
  const dispatch = useAppDispatch();
  const { exercises, isLoading } = useAppSelector((state) => state.exercises);
  const isDark = useAppSelector((state) => state.theme.isDark);
  const theme = isDark ? COLORS.dark : COLORS.light;

  useEffect(() => {
    dispatch(fetchExercises());
  }, []);

  const onRefresh = () => {
    dispatch(fetchExercises());
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

  const renderExerciseCard = ({ item }: { item: Exercise }) => (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}
      onPress={() => navigation.navigate('Details', { exercise: item })}
      activeOpacity={0.7}
    >
      <View style={[styles.iconContainer, { backgroundColor: theme.primary + '20' }]}>
        <Feather name={getTypeIcon(item.type) as any} size={32} color={theme.primary} />
      </View>

      <View style={styles.cardContent}>
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

      <Feather name="chevron-right" size={24} color={theme.textSecondary} />
    </TouchableOpacity>
  );

  if (isLoading && exercises.length === 0) {
    return (
      <View style={[styles.centered, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={theme.primary} />
        <Text style={[styles.loadingText, { color: theme.textSecondary }]}>
          Loading exercises...
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <FlatList
        data={exercises}
        renderItem={renderExerciseCard}
        keyExtractor={(item, index) => `${item.name}-${index}`}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={onRefresh}
            tintColor={theme.primary}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Feather name="alert-circle" size={64} color={theme.textSecondary} />
            <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
              No exercises found
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: SPACING.md,
    fontSize: FONT_SIZES.md,
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
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: BORDER_RADIUS.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  cardContent: {
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
  emptyContainer: {
    alignItems: 'center',
    marginTop: SPACING.xl * 2,
  },
  emptyText: {
    fontSize: FONT_SIZES.lg,
    marginTop: SPACING.md,
  },
});
