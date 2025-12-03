import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

export default function PantryScreen() {
  const router = useRouter();
  const [foodInput, setFoodInput] = useState('');
  const [loggedFoods, setLoggedFoods] = useState<string[]>([]);

  const handleLogFood = () => {
    if (!foodInput.trim()) return;

    setLoggedFoods((prev) => [...prev, foodInput.trim()]);
    setFoodInput('');
  };

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity onPress={() => router.back()}>
        <Ionicons name="arrow-back-circle" size={32} color="#43274F" />
      </TouchableOpacity>

      <Text style={styles.title}>The Pantry</Text>
      <Text style={styles.subtitle}>Log what you’ve eaten today</Text>

      <TextInput
        style={styles.input}
        placeholder="E.g., Grilled chicken, smoothie..."
        placeholderTextColor="#999"
        value={foodInput}
        onChangeText={setFoodInput}
      />

      <TouchableOpacity style={styles.logButton} onPress={handleLogFood}>
        <Text style={styles.logButtonText}>Log Food</Text>
      </TouchableOpacity>

      <Text style={styles.loggedTitle}>Today's Entries:</Text>
      {loggedFoods.length === 0 ? (
        <Text style={styles.empty}>No items logged yet</Text>
      ) : (
        loggedFoods.map((item, index) => (
          <View key={index} style={styles.foodItem}>
            <Ionicons name="fast-food" size={16} color="#3C2A3E" />
            <Text style={styles.foodText}>{item}</Text>
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: '#FFF4E9', padding: 24 },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3C2A3E',
    marginTop: 24,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#E5D4D2',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 12,
    color: '#3C2A3E',
  },
  logButton: {
    backgroundColor: '#43274F',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  logButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  loggedTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#3C2A3E',
    marginBottom: 8,
  },
  empty: {
    color: '#999',
    fontStyle: 'italic',
    marginTop: 8,
  },
  foodItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 8,
    borderBottomColor: '#ddd',
    borderBottomWidth: 1,
  },
  foodText: {
    fontSize: 16,
    color: '#3C2A3E',
  },
});
