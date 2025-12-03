import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Recipe } from '@/data/recipes';

interface RecipeCardProps {
  recipe: Recipe;
  isLiked: boolean;
  onLike: () => void;
  onPress?: () => void;
}

const getCategoryMeta = (category: string) => {
  switch (category) {
    case 'breakfast':
      return {
        icon: 'sunny-outline',
        backgroundColor: '#FFF4DA',
        accentColor: '#F4A261',
      };
    case 'lunch':
      return {
        icon: 'restaurant-outline',
        backgroundColor: '#E0F7F4',
        accentColor: '#2A9D8F',
      };
    case 'dinner':
      return {
        icon: 'moon-outline',
        backgroundColor: '#E8E4FF',
        accentColor: '#7A5AF8',
      };
    case 'snack':
      return {
        icon: 'fast-food-outline',
        backgroundColor: '#FFF1F0',
        accentColor: '#F25F5C',
      };
    default:
      return {
        icon: 'restaurant-outline',
        backgroundColor: '#EBDDD4',
        accentColor: '#43274F',
      };
  }
};

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case 'Easy':
      return '#8BC34A';
    case 'Medium':
      return '#FFC107';
    case 'Hard':
      return '#E76F51';
    default:
      return '#8BC34A';
  }
};

export default function RecipeCard({ recipe, isLiked, onLike, onPress }: RecipeCardProps) {
  const categoryMeta = getCategoryMeta(recipe.category);
  const difficultyColor = getDifficultyColor(recipe.difficulty);

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.cardHeader}>
        <View style={[styles.iconContainer, { backgroundColor: categoryMeta.backgroundColor }]}>
          <Ionicons
            name={categoryMeta.icon as any}
            size={26}
            color={categoryMeta.accentColor}
          />
        </View>
        <View style={styles.titleContainer}>
          <Text style={styles.recipeName}>{recipe.name}</Text>
          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <Ionicons name="flame" size={14} color="#E76F51" />
              <Text style={styles.metaText}>{recipe.calories} kcal</Text>
            </View>
            <View style={styles.metaItem}>
              <Ionicons name="time-outline" size={14} color="#666" />
              <Text style={styles.metaText}>{recipe.prepTime} min</Text>
            </View>
            <View
              style={[
                styles.difficultyBadge,
                { backgroundColor: difficultyColor + '20' },
              ]}
            >
              <Text
                style={[styles.difficultyText, { color: difficultyColor }]}
              >
                {recipe.difficulty}
              </Text>
            </View>
          </View>
        </View>
        <TouchableOpacity
          onPress={onLike}
          style={styles.likeButton}
          activeOpacity={0.6}
        >
          <Ionicons
            name={isLiked ? 'heart' : 'heart-outline'}
            size={24}
            color={isLiked ? '#E76F51' : '#666'}
          />
        </TouchableOpacity>
      </View>

      <Text style={styles.description}>{recipe.description}</Text>

      <View style={styles.categoryBadge}>
        <Text style={styles.categoryText}>
          {recipe.category.charAt(0).toUpperCase() + recipe.category.slice(1)}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#EBDDD4',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#F4E5D6',
  },
  titleContainer: {
    flex: 1,
  },
  recipeName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#3C2A3E',
    marginBottom: 6,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flexWrap: 'wrap',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    color: '#666',
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  difficultyText: {
    fontSize: 11,
    fontWeight: '600',
  },
  likeButton: {
    padding: 4,
  },
  description: {
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
    marginBottom: 12,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#DDBFB9',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#43274F',
  },
});

