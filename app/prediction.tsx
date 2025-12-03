import { supabase } from '@/lib/supabase';
import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function PredictionScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        console.error('Error fetching user:', authError);
        return;
      }

      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        return;
      }

      setProfile(data);
      setLoading(false);
    };

    fetchProfile();
  }, []);

  if (loading || !profile) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#43274F" />
        <Text style={styles.loadingText}>Loading prediction...</Text>
      </View>
    );
  }

  const {
    weight,
    ideal_weight_kg,
    gender,
    diet_type = 'Clean eating',
    water_goal = 8,
    activity_level = 'moderate',
  } = profile;
  
  const parsedWeight = typeof weight === 'number' ? weight : parseFloat(weight) || 0;
  const parsedIdealWeight = typeof ideal_weight_kg === 'number' ? ideal_weight_kg : parseFloat(ideal_weight_kg) || 0;

  const safeGender = typeof gender === 'string' && gender ? gender.toLowerCase() : 'female';
  const rawGender = profile.gender;
  const maintenanceCalories = safeGender === 'male' ? 2500 : 2000;
  
  if (!parsedWeight || !parsedIdealWeight) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>
          Incomplete weight data. Please finish onboarding.
        </Text>
      </View>
    );
  }

  const weightToLose = parsedWeight - parsedIdealWeight;
  const deficit = activity_level === 'high' ? 600 : activity_level === 'moderate' ? 500 : 300;
  const dailyCalorieGoal = maintenanceCalories - deficit;
  const caloriesToLose = weightToLose > 0 ? weightToLose * 3500 : 0;
  const estimatedWeeks = weightToLose > 0 && deficit > 0
    ? Math.ceil(caloriesToLose / (deficit * 7))
    : 2; // fallback to 2 weeks

  const handleFinish = () => {
    console.log('🎉 Onboarding complete!');
    router.push('../home/main');
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContent}>
      <View style={styles.container}>
        <Text style={styles.header}>
          You’ll reach your goal in about{' '}
          <Text style={styles.highlight}>
            {`${estimatedWeeks} week${estimatedWeeks > 1 ? 's' : ''}`}
          </Text>
        </Text>

        <Text style={styles.subheader}>
          Just 3 hours of exercise each week can get you to your goal
        </Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>
            {weightToLose > 0
              ? `Lose ${weightToLose} lb`
              : weightToLose < 0
              ? `Gain ${Math.abs(weightToLose)} lb`
              : 'Maintain weight'}
          </Text>
          <Text style={styles.cardText}>Starting from {parsedWeight}lb.</Text>
          <View style={styles.divider} />
          <Text style={styles.cardKcal}>
            {dailyCalorieGoal > 0 ? `${dailyCalorieGoal} kcal` : '—'}
          </Text>
          <Text style={styles.cardText}>Daily calorie intake.</Text>
          <FontAwesome5 name="fire" size={24} color="#43274F" style={styles.cardIcon} />
        </View>

        <View style={styles.summaryCard}>
          <Text style={styles.summaryItem}>
            Your diet: <Text style={styles.bold}>{diet_type}</Text>
          </Text>
          <View style={styles.divider} />

          <Text style={styles.summaryItem}>
            Activity intensity: <Text style={styles.bold}>{activity_level}</Text>
            {'\n'}
            <Text style={styles.small}>{estimatedWeeks} weeks</Text>
          </Text>
          <View style={styles.divider} />

          <Text style={styles.summaryItem}>
            Water intake: <Text style={styles.bold}>{water_goal} glasses</Text>
          </Text>
        </View>

        <TouchableOpacity style={styles.finishButton} onPress={handleFinish}>
          <Ionicons name="checkmark" size={20} color="#fff" />
          <Text style={styles.finishText}>Start Now!</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'flex-start',
    paddingHorizontal: 24,
    paddingTop: 48,
    paddingBottom: 24,
    backgroundColor: '#FFF4E9',
  },
  container: {
    flex: 1,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#43274F',
    textAlign: 'center',
    marginBottom: 8,
  },
  highlight: {
    fontSize: 28,
    color: '#43274F',
    fontWeight: 'bold',
  },
  subheader: {
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
    marginBottom: 24,
  },
  card: {
    backgroundColor: '#DDBFB9',
    padding: 20,
    borderRadius: 12,
    marginBottom: 24,
    position: 'relative',
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#43274F',
    marginBottom: 4,
  },
  cardText: {
    fontSize: 14,
    color: '#444',
    marginBottom: 6,
  },
  divider: {
    height: 1,
    backgroundColor: '#ccc',
    marginVertical: 10,
  },
  cardKcal: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#43274F',
  },
  cardIcon: {
    position: 'absolute',
    bottom: 20,
    right: 20,
  },
  summaryCard: {
    backgroundColor: '#D7C9A6',
    padding: 20,
    borderRadius: 12,
    marginBottom: 40,
  },
  summaryItem: {
    fontSize: 16,
    color: '#3C2A3E',
    marginBottom: 8,
  },
  bold: {
    fontWeight: 'bold',
  },
  small: {
    fontSize: 12,
    color: '#555',
  },
  finishButton: {
    flexDirection: 'row',
    backgroundColor: '#C6AFA2',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 28,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    gap: 8,
    marginTop: 32,
  },
  finishText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF4E9',
  },
  loadingText: {
    marginTop: 12,
    color: '#43274F',
    fontWeight: '600',
  },
});
