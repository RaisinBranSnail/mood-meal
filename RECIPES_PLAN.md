# Recipes Page Plan

## Design Overview
- **Background**: `#FFF4E9` (consistent with app)
- **Card Colors**: Warm tones matching existing cards (#E5D4D2, #DDBFB9, #EBDDD4)
- **Primary Color**: `#43274F` (buttons, accents)
- **Text Color**: `#3C2A3E` (headers, labels)

## Features

### 1. Recipe Cards
- Recipe name
- Image placeholder/icon
- Calories per serving
- Prep time
- Difficulty level
- Like button (heart icon)
- Brief description

### 2. Like Functionality
- Tap heart to like/unlike
- Liked recipes stored in Supabase
- Visual feedback (filled heart when liked)
- Persists across sessions

### 3. Liked Section
- Tab/button to view only liked recipes
- Empty state when no liked recipes
- Same card design as main recipes

### 4. Recipe Data
- Sample recipes with:
  - Name
  - Calories
  - Prep time
  - Difficulty
  - Description
  - Category (breakfast, lunch, dinner, snack)

## Component Structure

```
RecipesScreen
├── Header (with back button)
├── Tab Switcher (All Recipes / Liked)
├── ScrollView
│   ├── RecipeCard (repeat for each recipe)
│   │   ├── Recipe Image/Icon
│   │   ├── Recipe Info
│   │   ├── Like Button
│   │   └── View Details Button
└── Empty State (for liked section)
```

## Sample Recipes
1. Grilled Chicken Salad - 320 kcal, 15 min, Easy
2. Quinoa Power Bowl - 450 kcal, 20 min, Medium
3. Avocado Toast - 280 kcal, 5 min, Easy
4. Salmon & Veggies - 380 kcal, 25 min, Medium
5. Greek Yogurt Parfait - 220 kcal, 5 min, Easy
6. Turkey Wrap - 350 kcal, 10 min, Easy
7. Veggie Stir Fry - 290 kcal, 15 min, Easy
8. Protein Smoothie - 250 kcal, 5 min, Easy


