import { supabase } from '@/lib/supabase';
import { Ionicons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import React, { useState } from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

interface Props {
  onNext: () => void;
  onBack: () => void;
}

export default function WeightScreen({ onNext, onBack }: Props) {
  const [unit, setUnit] = useState<'kg' | 'lbs'>('lbs');
  const [weight, setWeight] = useState(unit === 'lbs' ? 150 : 68);
  const [loading, setLoading] = useState(false);

  const min = unit === 'lbs' ? 70 : 30;
  const max = unit === 'lbs' ? 300 : 140;
  const displayWeight = `${weight}${unit}`;

  const handleUnitSwitch = (newUnit: 'kg' | 'lbs') => {
    if (newUnit === unit) return;

    const converted = unit === 'lbs'
      ? weight / 2.205
      : weight * 2.205;

    setUnit(newUnit);
    setWeight(Math.round(converted));
  };

  const handleNext = async () => {
    setLoading(true);
    const weightKg = unit === 'kg' ? weight : Math.round(weight / 2.205);

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      console.error('❌ User not authenticated:', authError);
      setLoading(false);
      return;
    }

    const { error } = await supabase
      .from('user_profiles')
      .update({ weight: weightKg })
      .eq('user_id', user.id);

    if (error) {
      console.error('❌ Error saving weight to Supabase:', error);
    } else {
      console.log('✅ Weight saved to Supabase');
      onNext();
    }

    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>What’s your weight?</Text>

      <View style={styles.unitToggle}>
        <TouchableOpacity
          style={[styles.unitOption, unit === 'kg' && styles.activeUnit]}
          onPress={() => handleUnitSwitch('kg')}
        >
          <Text style={styles.unitLabel}>kg</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.unitOption, unit === 'lbs' && styles.activeUnit]}
          onPress={() => handleUnitSwitch('lbs')}
        >
          <Text style={styles.unitLabel}>lbs</Text>
        </TouchableOpacity>
      </View>

      <Slider
        style={styles.slider}
        minimumValue={min}
        maximumValue={max}
        step={1}
        value={weight}
        onValueChange={setWeight}
        minimumTrackTintColor="#43274F"
        maximumTrackTintColor="#DDD"
        thumbTintColor="#43274F"
      />

      <View style={styles.displayBox}>
        <Text style={styles.displayText}>{displayWeight}</Text>
      </View>

      <View style={styles.navContainer}>
        <TouchableOpacity style={styles.navButtonBack} onPress={onBack}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navButtonNext}
          onPress={handleNext}
          disabled={loading}
        >
          <Ionicons name="arrow-forward" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF4E9',
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3C2A3E',
    textAlign: 'center',
    marginBottom: 32,
  },
  unitToggle: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 32,
    gap: 8,
  },
  unitOption: {
    paddingVertical: 6,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: '#EEE',
  },
  activeUnit: {
    backgroundColor: '#43274F',
  },
  unitLabel: {
    color: '#FFF',
    fontWeight: '600',
  },
  slider: {
    width: '100%',
    height: 40,
  },
  displayBox: {
    backgroundColor: '#43274F',
    padding: 16,
    borderRadius: 8,
    marginTop: 24,
    alignSelf: 'center',
  },
  displayText: {
    fontSize: 24,
    color: '#FFF',
    fontWeight: 'bold',
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
    backgroundColor: '#43274F',
    borderRadius: 25,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
