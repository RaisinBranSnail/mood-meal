import { supabase } from '@/lib/supabase';
import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type GoalOption = 'lose' | 'healthy' | 'gain';

interface Props {
  onNext: () => void;
  onBack: () => void;
}

export default function GoalScreen({ onNext, onBack }: Props) {
  const [selectedGoal, setSelectedGoal] = useState<GoalOption | null>(null);
  const [loading, setLoading] = useState(false);

  const handleNext = async () => {
    if (!selectedGoal) return;

    setLoading(true);

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      console.error('❌ User not authenticated', authError);
      setLoading(false);
      return;
    }

    const { error } = await supabase
      .from('user_profiles')
      .update({ food_goal: selectedGoal })
      .eq('user_id', user.id);

    if (error) {
      console.error('❌ Error saving goal to Supabase:', error);
    } else {
      console.log('✅ Goal saved to Supabase');
      onNext();
    }

    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>What’s your goal?</Text>

      <View style={styles.optionsContainer}>
        {[
          { value: 'lose', label: 'Lose weight', icon: 'weight', color: '#FDD835' },
          { value: 'healthy', label: 'Stay healthy', icon: 'apple-alt', color: '#8BC34A' },
          { value: 'gain', label: 'Gain weight', icon: 'dumbbell', color: '#FF8A65' },
        ].map(({ value, label, icon, color }) => (
          <TouchableOpacity
            key={value}
            style={[styles.option, selectedGoal === value && styles.selectedOption]}
            onPress={() => setSelectedGoal(value as GoalOption)}
          >
            <Text style={styles.optionLabel}>{label}</Text>
            <FontAwesome5 name={icon as any} size={24} color={color} />
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.navContainer}>
        <TouchableOpacity style={styles.navButtonBack} onPress={onBack}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.navButtonNext,
            { backgroundColor: selectedGoal ? '#43274F' : '#B9AFAF' },
          ]}
          disabled={!selectedGoal || loading}
          onPress={handleNext}
        >
          <Ionicons name="arrow-forward" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FFF4E9', padding: 24, justifyContent: 'center' },
    progressBar: {
      flexDirection: 'row',
      gap: 8,
      position: 'absolute',
      top: 60,
      alignSelf: 'center',
    },
    progressDot: {
      width: 40,
      height: 6,
      borderRadius: 3,
      backgroundColor: '#A49A9A',
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#3C2A3E',
      textAlign: 'center',
      marginBottom: 40,
    },
    optionsContainer: { gap: 16 },
    option: {
      backgroundColor: '#FFF',
      padding: 16,
      borderRadius: 12,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: '#eee',
    },
    selectedOption: {
      borderColor: '#43274F',
      borderWidth: 2,
    },
    optionLabel: {
      fontSize: 18,
      color: '#3C2A3E',
    },
    navContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 40,
      paddingHorizontal: 12,
    },
    navButtonBack: {
      backgroundColor: '#FDBE9C',
      borderRadius: 25,
      width: 50,
      height: 50,
      justifyContent: 'center',
      alignItems: 'center',
    },
    navButtonNext: {
      borderRadius: 25,
      width: 50,
      height: 50,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });