import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { supabase } from '@/lib/supabase';

interface Props {
  onNext: () => void;
  onBack: () => void;
}

type ActivityLevel = 'low' | 'moderate' | 'high';

export default function ActiveScreen({ onNext, onBack }: Props) {
  const [selectedLevel, setSelectedLevel] = useState<ActivityLevel | null>(null);
  const [loading, setLoading] = useState(false);

  const handleNext = async () => {
    if (!selectedLevel) return;
    setLoading(true);

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      console.error('❌ Auth error while saving activity level:', authError);
      setLoading(false);
      return;
    }

    const { error } = await supabase
      .from('user_profiles')
      .update({ activity_level: selectedLevel })
      .eq('user_id', user.id);

    if (error) {
      console.error('❌ Supabase error saving activity level:', error);
    } else {
      console.log('✅ Activity level saved to Supabase');
      onNext();
    }

    setLoading(false);
  };

  const options = [
    {
      value: 'low' as ActivityLevel,
      title: 'Not very active',
      description: 'I have a sedentary lifestyle.',
      example: 'E.g. desk job, bank teller',
      image: require('@/assets/images/activity-low.png'),
    },
    {
      value: 'moderate' as ActivityLevel,
      title: 'Moderately active',
      description: 'I spend a good part of my day on my feet.',
      example: 'E.g. teacher, sales person',
      image: require('@/assets/images/activity-moderate.png'),
    },
    {
      value: 'high' as ActivityLevel,
      title: 'Very Active',
      description: 'I spend most of my day doing heavy physical work or activity.',
      example: 'E.g. carpenter, construction worker',
      image: require('@/assets/images/activity-high.png'),
    },
  ];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>How active are you?</Text>

      {options.map((opt) => (
        <TouchableOpacity
          key={opt.value}
          style={[
            styles.card,
            selectedLevel === opt.value && styles.selectedCard,
          ]}
          onPress={() => setSelectedLevel(opt.value)}
        >
          <View style={styles.cardContent}>
            <View style={{ flex: 1 }}>
              <Text style={styles.cardTitle}>{opt.title}</Text>
              <Text style={styles.cardDesc}>{opt.description}</Text>
              <Text style={styles.cardExample}>{opt.example}</Text>
            </View>
            <Image source={opt.image} style={styles.cardImage} />
          </View>
        </TouchableOpacity>
      ))}

      <View style={styles.navContainer}>
        <TouchableOpacity style={styles.navButtonBack} onPress={onBack}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.navButtonNext,
            { backgroundColor: selectedLevel ? '#43274F' : '#B9AFAF' },
          ]}
          disabled={!selectedLevel || loading}
          onPress={handleNext}
        >
          <Ionicons name="arrow-forward" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFF4E9',
    padding: 24,
    paddingBottom: 60,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3C2A3E',
    textAlign: 'center',
    marginVertical: 24,
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#eee',
    marginBottom: 16,
  },
  selectedCard: {
    borderColor: '#43274F',
    borderWidth: 2,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2D1A1A',
    marginBottom: 4,
  },
  cardDesc: {
    fontSize: 14,
    color: '#555',
    flexWrap: 'wrap',
  },
  cardExample: {
    fontSize: 12,
    color: '#999',
    fontStyle: 'italic',
    marginTop: 4,
  },
  cardImage: {
    width: 60,
    height: 60,
    resizeMode: 'contain',
    marginLeft: 12,
    alignSelf: 'flex-start',
  },
  navContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 32,
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
