import { supabase } from '@/lib/supabase';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import RecipeCard from '@/components/recipes/RecipeCard';
import { SAMPLE_RECIPES, Recipe } from '@/data/recipes';

export default function RecipesScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'all' | 'liked'>('all');
  const [difficultyFilter, setDifficultyFilter] = useState<'All' | 'Easy' | 'Medium' | 'Hard'>('All');
  const [categoryFilter, setCategoryFilter] = useState<'All' | 'breakfast' | 'lunch' | 'dinner' | 'snack'>('All');
  const [dietFilter, setDietFilter] = useState<'All' | 'clean' | 'mediterranean' | 'keto' | 'lowcarb'>('All');
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [likedRecipeIds, setLikedRecipeIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const overlayOpacity = useSharedValue(0);
  const modalTranslateY = useSharedValue(1000);

  useEffect(() => {
    fetchLikedRecipes();
  }, []);

  useEffect(() => {
    if (filterModalVisible) {
      overlayOpacity.value = withTiming(1, {
        duration: 300,
        easing: Easing.out(Easing.cubic),
      });
      modalTranslateY.value = withTiming(0, {
        duration: 350,
        easing: Easing.out(Easing.cubic),
      });
    } else {
      overlayOpacity.value = withTiming(0, {
        duration: 250,
        easing: Easing.in(Easing.ease),
      });
      modalTranslateY.value = withTiming(1000, {
        duration: 250,
        easing: Easing.in(Easing.ease),
      });
    }
  }, [filterModalVisible]);

  const overlayAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: overlayOpacity.value,
    };
  });

  const modalContentAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: modalTranslateY.value }],
    };
  });

  const fetchLikedRecipes = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setLoading(false);
        return;
      }

      // Fetch liked recipes from Supabase
      const { data, error } = await supabase
        .from('liked_recipes')
        .select('recipe_id')
        .eq('user_id', user.id);

      if (error) {
        console.error('Error fetching liked recipes:', error);
        // If table doesn't exist, continue without error
        setLikedRecipeIds(new Set());
      } else {
        const likedIds = new Set(data?.map((item) => item.recipe_id) || []);
        setLikedRecipeIds(likedIds);
      }
    } catch (error) {
      console.error('Error:', error);
      setLikedRecipeIds(new Set());
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (recipeId: string, isLiked: boolean) => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      if (isLiked) {
        // Unlike - remove from database
        await supabase
          .from('liked_recipes')
          .delete()
          .eq('user_id', user.id)
          .eq('recipe_id', recipeId);
        
        setLikedRecipeIds((prev) => {
          const newSet = new Set(prev);
          newSet.delete(recipeId);
          return newSet;
        });
      } else {
        // Like - add to database
        await supabase.from('liked_recipes').insert([
          {
            user_id: user.id,
            recipe_id: recipeId,
          },
        ]);
        
        setLikedRecipeIds((prev) => {
          const newSet = new Set(prev);
          newSet.add(recipeId);
          return newSet;
        });
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const displayedRecipes = (() => {
    let recipes = activeTab === 'liked'
      ? SAMPLE_RECIPES.filter((recipe) => likedRecipeIds.has(recipe.id))
      : SAMPLE_RECIPES;
    
    // Apply difficulty filter
    if (difficultyFilter !== 'All') {
      recipes = recipes.filter((recipe) => recipe.difficulty === difficultyFilter);
    }
    
    // Apply category filter
    if (categoryFilter !== 'All') {
      recipes = recipes.filter((recipe) => recipe.category === categoryFilter);
    }
    
    // Apply diet filter
    if (dietFilter !== 'All') {
      recipes = recipes.filter((recipe) => recipe.dietType === dietFilter);
    }
    
    return recipes;
  })();

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => {
            if (router.canGoBack()) {
              router.back();
            } else {
              router.push('/home/main');
            }
          }}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back-circle" size={32} color="#43274F" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Recipes</Text>
        <TouchableOpacity 
          onPress={() => setFilterModalVisible(true)}
          activeOpacity={0.7}
        >
          <Ionicons name="filter" size={28} color="#43274F" />
        </TouchableOpacity>
      </View>

      {/* Tab Switcher */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'all' && styles.activeTab]}
          onPress={() => setActiveTab('all')}
        >
          <Text style={[styles.tabText, activeTab === 'all' && styles.activeTabText]}>
            All Recipes
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'liked' && styles.activeTab]}
          onPress={() => setActiveTab('liked')}
        >
          <Ionicons
            name={activeTab === 'liked' ? 'heart' : 'heart-outline'}
            size={18}
            color={activeTab === 'liked' ? '#43274F' : '#666'}
          />
          <Text style={[styles.tabText, activeTab === 'liked' && styles.activeTabText]}>
            Liked ({likedRecipeIds.size})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Active Filters Indicator */}
      {(difficultyFilter !== 'All' || categoryFilter !== 'All' || dietFilter !== 'All') && (
        <View style={styles.activeFiltersContainer}>
          <Text style={styles.activeFiltersText}>Filters active</Text>
          <TouchableOpacity
            onPress={() => {
              setDifficultyFilter('All');
              setCategoryFilter('All');
              setDietFilter('All');
            }}
            style={styles.clearFiltersButton}
          >
            <Text style={styles.clearFiltersText}>Clear all</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Recipes List */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {displayedRecipes.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons
              name={activeTab === 'liked' ? 'heart-outline' : 'restaurant-outline'}
              size={64}
              color="#D3CCC8"
            />
            <Text style={styles.emptyText}>
              {activeTab === 'liked'
                ? 'No liked recipes yet'
                : `No ${difficultyFilter !== 'All' ? difficultyFilter.toLowerCase() : ''} recipes found`}
            </Text>
            <Text style={styles.emptySubtext}>
              {activeTab === 'liked'
                ? 'Tap the heart icon on recipes to save them here'
                : 'Try adjusting your filters or check back later'}
            </Text>
          </View>
        ) : (
          <View style={styles.recipesGrid}>
            {displayedRecipes.map((recipe) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                isLiked={likedRecipeIds.has(recipe.id)}
                onLike={() => handleLike(recipe.id, likedRecipeIds.has(recipe.id))}
                onPress={() => router.push(`/home/recipe-detail?id=${recipe.id}`)}
              />
            ))}
          </View>
        )}
      </ScrollView>

      {/* Filter Modal */}
      <Modal
        visible={filterModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setFilterModalVisible(false)}
        // @ts-ignore - web-only prop
        presentationStyle="overFullScreen"
      >
        <Animated.View 
          style={[styles.modalOverlay, overlayAnimatedStyle]} 
          testID="modal-overlay"
        >
          <Animated.View 
            style={[styles.modalContent, modalContentAnimatedStyle]} 
            testID="modal-content"
          >
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Filters</Text>
              <TouchableOpacity 
                onPress={() => setFilterModalVisible(false)}
                style={styles.modalCloseButton}
                activeOpacity={0.7}
              >
                <Ionicons name="close-circle" size={32} color="#43274F" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalScrollContent}>
              {/* Difficulty Filter */}
              <View style={styles.modalFilterSection}>
                <Text style={styles.modalFilterLabel}>Difficulty</Text>
                <View style={styles.modalFilterButtons}>
                  {(['All', 'Easy', 'Medium', 'Hard'] as const).map((difficulty) => (
                    <TouchableOpacity
                      key={difficulty}
                      style={[
                        styles.modalFilterButton,
                        difficultyFilter === difficulty && styles.activeModalFilterButton,
                      ]}
                      onPress={() => setDifficultyFilter(difficulty)}
                    >
                      <Text
                        style={[
                          styles.modalFilterButtonText,
                          difficultyFilter === difficulty && styles.activeModalFilterButtonText,
                        ]}
                      >
                        {difficulty}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Category Filter */}
              <View style={styles.modalFilterSection}>
                <Text style={styles.modalFilterLabel}>Meal Type</Text>
                <View style={styles.modalFilterButtons}>
                  {(['All', 'breakfast', 'lunch', 'dinner', 'snack'] as const).map((category) => (
                    <TouchableOpacity
                      key={category}
                      style={[
                        styles.modalFilterButton,
                        categoryFilter === category && styles.activeModalFilterButton,
                      ]}
                      onPress={() => setCategoryFilter(category)}
                    >
                      <Text
                        style={[
                          styles.modalFilterButtonText,
                          categoryFilter === category && styles.activeModalFilterButtonText,
                        ]}
                      >
                        {category === 'All' ? 'All' : category.charAt(0).toUpperCase() + category.slice(1)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Diet Filter */}
              <View style={styles.modalFilterSection}>
                <Text style={styles.modalFilterLabel}>Diet Type</Text>
                <View style={styles.modalFilterButtons}>
                  {(['All', 'clean', 'mediterranean', 'keto', 'lowcarb'] as const).map((diet) => (
                    <TouchableOpacity
                      key={diet}
                      style={[
                        styles.modalFilterButton,
                        dietFilter === diet && styles.activeModalFilterButton,
                      ]}
                      onPress={() => setDietFilter(diet)}
                    >
                      <Text
                        style={[
                          styles.modalFilterButtonText,
                          dietFilter === diet && styles.activeModalFilterButtonText,
                        ]}
                      >
                        {diet === 'All' ? 'All' : diet.charAt(0).toUpperCase() + diet.slice(1)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.modalClearButton}
                onPress={() => {
                  setDifficultyFilter('All');
                  setCategoryFilter('All');
                  setDietFilter('All');
                }}
              >
                <Text style={styles.modalClearButtonText}>Clear All</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalApplyButton}
                onPress={() => setFilterModalVisible(false)}
              >
                <Text style={styles.modalApplyButtonText}>Apply Filters</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </Animated.View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF4E9',
    // @ts-ignore - web-only style
    position: 'relative',
    // @ts-ignore - web-only style
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
    paddingTop: 48,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3C2A3E',
  },
  activeFiltersContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 8,
    backgroundColor: '#F8C9A0',
  },
  activeFiltersText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#43274F',
  },
  clearFiltersButton: {
    paddingVertical: 4,
    paddingHorizontal: 12,
  },
  clearFiltersText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#E76F51',
    textDecorationLine: 'underline',
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    gap: 12,
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#E5D4D2',
  },
  activeTab: {
    backgroundColor: '#43274F',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  activeTabText: {
    color: '#FFF',
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 100,
  },
  recipesGrid: {
    gap: 16,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#3C2A3E',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginTop: 8,
    paddingHorizontal: 40,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'flex-end',
    // @ts-ignore - web-only style
    position: Platform.OS === 'web' ? 'fixed' : 'absolute',
    // @ts-ignore - web-only style
    top: 0,
    // @ts-ignore - web-only style
    left: Platform.OS === 'web' ? '50%' : 0,
    // @ts-ignore - web-only style
    right: Platform.OS === 'web' ? 'auto' : 0,
    // @ts-ignore - web-only style
    bottom: 0,
    // @ts-ignore - web-only style
    zIndex: 1000,
    // @ts-ignore - web-only style
    width: Platform.OS === 'web' ? 'min(414px, 100vw)' : '100%',
    // @ts-ignore - web-only style
    maxWidth: Platform.OS === 'web' ? '414px' : '100%',
    // @ts-ignore - web-only style
    transform: Platform.OS === 'web' ? 'translateX(-50%)' : 'none',
    // @ts-ignore - web-only style
    transition: 'opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  },
  modalContent: {
    backgroundColor: '#FFF4E9',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '85%',
    paddingBottom: 40,
    // @ts-ignore - web-only style
    width: '100%',
    // @ts-ignore - web-only style
    maxWidth: '100%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
    paddingTop: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5D4D2',
    // @ts-ignore - web-only style
    position: 'sticky',
    // @ts-ignore - web-only style
    top: 0,
    backgroundColor: '#FFF4E9',
    // @ts-ignore - web-only style
    zIndex: 10,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#3C2A3E',
  },
  modalCloseButton: {
    // @ts-ignore - web-only style
    minWidth: 44,
    // @ts-ignore - web-only style
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalScrollContent: {
    padding: 24,
    // @ts-ignore - web-only style
    maxHeight: 'calc(85vh - 200px)',
  },
  modalFilterSection: {
    marginBottom: 24,
  },
  modalFilterLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3C2A3E',
    marginBottom: 12,
  },
  modalFilterButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  modalFilterButton: {
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 20,
    backgroundColor: '#E5D4D2',
    borderWidth: 1,
    borderColor: '#D3CCC8',
    // @ts-ignore - web-only style
    minHeight: 44, // iOS touch target minimum
    // @ts-ignore - web-only style
    minWidth: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeModalFilterButton: {
    backgroundColor: '#43274F',
    borderColor: '#43274F',
  },
  modalFilterButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  activeModalFilterButtonText: {
    color: '#FFF',
  },
  modalFooter: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 8,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5D4D2',
    // @ts-ignore - web-only style
    position: 'sticky',
    // @ts-ignore - web-only style
    bottom: 0,
    backgroundColor: '#FFF4E9',
  },
  modalClearButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: '#FDBE9C',
    alignItems: 'center',
    justifyContent: 'center',
    // @ts-ignore - web-only style
    minHeight: 48, // Touch-friendly button height
  },
  modalClearButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#3C2A3E',
  },
  modalApplyButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: '#43274F',
    alignItems: 'center',
    justifyContent: 'center',
    // @ts-ignore - web-only style
    minHeight: 48, // Touch-friendly button height
  },
  modalApplyButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFF',
  },
});

