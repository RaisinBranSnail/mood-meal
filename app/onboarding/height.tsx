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

export default function HeightScreen({ onNext, onBack }: Props) {
  const [unit, setUnit] = useState<'ft' | 'cm'>('ft');
  const [heightCm, setHeightCm] = useState(160);
  const [heightInches, setHeightInches] = useState(63);
  const [loading, setLoading] = useState(false);

  const handleUnitSwitch = (newUnit: 'ft' | 'cm') => {
    if (newUnit === unit) return;

    if (newUnit === 'cm') {
      const cm = Math.round(heightInches * 2.54);
      setHeightCm(cm);
    } else {
      const inches = Math.round(heightCm / 2.54);
      setHeightInches(inches);
    }

    setUnit(newUnit);
  };

  const renderFormattedHeight = () => {
    if (unit === 'cm') {
      return `${heightCm} cm`;
    } else {
      const feet = Math.floor(heightInches / 12);
      const inches = heightInches % 12;
      return `${feet}'${inches}"`;
    }
  };

  const handleNext = async () => {
    setLoading(true);

    const heightToSave = unit === 'cm' ? heightCm : Math.round(heightInches * 2.54);

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
      .update({ height: heightToSave })
      .eq('user_id', user.id);

    if (error) {
      console.error('❌ Error saving height to Supabase:', error);
    } else {
      console.log('✅ Height saved to Supabase');
      onNext();
    }

    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>How tall are you?</Text>

      <View style={styles.unitToggle}>
        <TouchableOpacity
          style={[styles.unitOption, unit === 'cm' && styles.activeUnit]}
          onPress={() => handleUnitSwitch('cm')}
        >
          <Text style={unit === 'cm' ? styles.unitTextActive : styles.unitText}>
            cm
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.unitOption, unit === 'ft' && styles.activeUnit]}
          onPress={() => handleUnitSwitch('ft')}
        >
          <Text style={unit === 'ft' ? styles.unitTextActive : styles.unitText}>
            ft
          </Text>
        </TouchableOpacity>
      </View>

      <Slider
        style={styles.slider}
        minimumValue={unit === 'cm' ? 120 : 48}
        maximumValue={unit === 'cm' ? 210 : 84}
        step={1}
        value={unit === 'cm' ? heightCm : heightInches}
        onValueChange={(value) =>
          unit === 'cm' ? setHeightCm(value) : setHeightInches(value)
        }
        minimumTrackTintColor="#43274F"
        maximumTrackTintColor="#DDD"
        thumbTintColor="#43274F"
      />

      <View style={styles.displayBox}>
        <Text style={styles.displayText}>{renderFormattedHeight()}</Text>
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
    marginBottom: 24,
  },
  unitToggle: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 24,
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
  unitText: {
    color: '#333',
    fontWeight: '600',
  },
  unitTextActive: {
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
