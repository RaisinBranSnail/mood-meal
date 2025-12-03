import { supabase } from '@/lib/supabase';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SAMPLE_RECIPES, Recipe } from '@/data/recipes';

export default function RecipeDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    if (id) {
      const foundRecipe = SAMPLE_RECIPES.find((r) => r.id === id);
      setRecipe(foundRecipe || null);
      checkIfLiked(id);
    }
  }, [id]);

  const checkIfLiked = async (recipeId: string) => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { data } = await supabase
        .from('liked_recipes')
        .select('recipe_id')
        .eq('user_id', user.id)
        .eq('recipe_id', recipeId)
        .single();

      setIsLiked(!!data);
    } catch (error) {
      // Table might not exist, ignore error
      setIsLiked(false);
    }
  };

  const handleLike = async () => {
    if (!recipe) return;

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      if (isLiked) {
        await supabase
          .from('liked_recipes')
          .delete()
          .eq('user_id', user.id)
          .eq('recipe_id', recipe.id);
        setIsLiked(false);
      } else {
        await supabase.from('liked_recipes').insert([
          {
            user_id: user.id,
            recipe_id: recipe.id,
          },
        ]);
        setIsLiked(true);
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'breakfast':
        return 'coffee-outline';
      case 'lunch':
        return 'restaurant-outline';
      case 'dinner':
        return 'restaurant-outline';
      case 'snack':
        return 'fast-food-outline';
      default:
        return 'restaurant-outline';
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

  if (!recipe) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Recipe not found</Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const difficultyColor = getDifficultyColor(recipe.difficulty);
  const categoryIcon = getCategoryIcon(recipe.category);
  const totalTime = recipe.prepTime + (recipe.cookTime || 0);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back-circle" size={32} color="#43274F" />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleLike} style={styles.likeButton}>
          <Ionicons
            name={isLiked ? 'heart' : 'heart-outline'}
            size={28}
            color={isLiked ? '#E76F51' : '#43274F'}
          />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Recipe Title & Meta */}
        <View style={styles.titleSection}>
          <View style={styles.iconContainer}>
            <MaterialCommunityIcons
              name={categoryIcon as any}
              size={48}
              color="#43274F"
            />
          </View>
          <Text style={styles.recipeTitle}>{recipe.name}</Text>
          <Text style={styles.recipeDescription}>{recipe.description}</Text>

          <View style={styles.metaContainer}>
            <View style={styles.metaCard}>
              <Ionicons name="flame" size={20} color="#E76F51" />
              <Text style={styles.metaValue}>{recipe.calories}</Text>
              <Text style={styles.metaLabel}>kcal</Text>
            </View>
            <View style={styles.metaCard}>
              <Ionicons name="time-outline" size={20} color="#43274F" />
              <Text style={styles.metaValue}>{totalTime}</Text>
              <Text style={styles.metaLabel}>min</Text>
            </View>
            <View style={styles.metaCard}>
              <Ionicons name="people-outline" size={20} color="#43274F" />
              <Text style={styles.metaValue}>{recipe.servings}</Text>
              <Text style={styles.metaLabel}>servings</Text>
            </View>
            <View
              style={[
                styles.metaCard,
                styles.difficultyCard,
                { backgroundColor: difficultyColor + '20' },
              ]}
            >
              <Text style={[styles.metaValue, styles.difficultyText, { color: difficultyColor }]}>
                {recipe.difficulty}
              </Text>
            </View>
          </View>
        </View>

        {/* Ingredients Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ingredients</Text>
          <View style={styles.ingredientsCard}>
            {recipe.ingredients.map((ingredient, index) => (
              <View key={index} style={styles.ingredientItem}>
                <View style={styles.ingredientBullet} />
                <Text style={styles.ingredientText}>{ingredient}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Instructions Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Instructions</Text>
          <View style={styles.instructionsCard}>
            {recipe.instructions.map((instruction, index) => (
              <View key={index} style={styles.instructionItem}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>{index + 1}</Text>
                </View>
                <Text style={styles.instructionText}>{instruction}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF4E9',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF4E9',
  },
  loadingText: {
    fontSize: 18,
    color: '#3C2A3E',
    marginBottom: 20,
  },
  backButton: {
    backgroundColor: '#43274F',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  backButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
    paddingTop: 48,
  },
  likeButton: {
    padding: 4,
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 100,
  },
  titleSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#EBDDD4',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  recipeTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#3C2A3E',
    textAlign: 'center',
    marginBottom: 8,
  },
  recipeDescription: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  metaContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    flexWrap: 'wrap',
  },
  metaCard: {
    backgroundColor: '#EBDDD4',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 70,
  },
  difficultyCard: {
    justifyContent: 'center',
  },
  metaValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#43274F',
    marginTop: 4,
  },
  difficultyText: {
    marginTop: 0,
    textAlign: 'center',
  },
  metaLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#3C2A3E',
    marginBottom: 12,
  },
  ingredientsCard: {
    backgroundColor: '#DDBFB9',
    borderRadius: 12,
    padding: 20,
  },
  ingredientItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  ingredientBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#43274F',
    marginTop: 6,
    marginRight: 12,
  },
  ingredientText: {
    flex: 1,
    fontSize: 16,
    color: '#3C2A3E',
    lineHeight: 24,
  },
  instructionsCard: {
    backgroundColor: '#D7C9A6',
    borderRadius: 12,
    padding: 20,
  },
  instructionItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#43274F',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    flexShrink: 0,
  },
  stepNumberText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  instructionText: {
    flex: 1,
    fontSize: 16,
    color: '#3C2A3E',
    lineHeight: 24,
  },
});

