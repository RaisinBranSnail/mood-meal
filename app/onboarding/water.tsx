import Calculating from '@/components/Calculating';
import { supabase } from '@/lib/supabase';
import { Entypo, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface Props {
  onNext: () => void;
  onBack: () => void;
}

export default function WaterScreen({ onNext, onBack }: Props) {
  const [glasses, setGlasses] = useState(10);
  const [isCalculating, setIsCalculating] = useState(false);
  const router = useRouter();

  const increment = () => {
    if (glasses < 20) setGlasses((prev) => prev + 1);
  };

  const decrement = () => {
    if (glasses > 1) setGlasses((prev) => prev - 1);
  };

  const handleSubmit = async () => {
    setIsCalculating(true);

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      console.error('❌ Auth error saving water:', authError);
      setIsCalculating(false);
      return;
    }

    const { error } = await supabase
      .from('user_profiles')
      .update({ water_goal: glasses })
      .eq('user_id', user.id);

    if (error) {
      console.error('❌ Supabase error saving water:', error);
      setIsCalculating(false);
      return;
    }

    console.log('✅ Water intake saved to Supabase');

    setTimeout(() => {
      router.push('/prediction');
    }, 5000);
  };

  if (isCalculating) {
    return <Calculating />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>What’s your water{'\n'}intake goal?</Text>

      <View style={styles.counterContainer}>
        <View style={styles.glassDisplay}>
          <Text style={styles.glassText}>{glasses} glasses</Text>
        </View>

        <View style={styles.arrows}>
          <TouchableOpacity onPress={increment} style={styles.arrowButton}>
            <Entypo name="chevron-up" size={24} color="#888" />
          </TouchableOpacity>
          <TouchableOpacity onPress={decrement} style={styles.arrowButton}>
            <Entypo name="chevron-down" size={24} color="#888" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.navContainer}>
        <TouchableOpacity style={styles.navButtonBack} onPress={onBack}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.navButtonNext} onPress={handleSubmit}>
          <Ionicons name="checkmark" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF4E9',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3C2A3E',
    textAlign: 'center',
    marginBottom: 48,
  },
  counterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  glassDisplay: {
    backgroundColor: '#A5B4CB',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  glassText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  arrows: {
    justifyContent: 'center',
    gap: 8,
  },
  arrowButton: {
    backgroundColor: '#DDD5D5',
    padding: 6,
    borderRadius: 6,
    alignItems: 'center',
  },
  navContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 12,
    marginTop: 60,
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
    backgroundColor: '#43274F',
    borderRadius: 25,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
