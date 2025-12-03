import BottomNavbar from '@/components/BottomNavbar';
import { supabase } from '@/lib/supabase';
import { FontAwesome5, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import PredictionScreen from '../prediction';
import SettingsScreen from './settings';
import CalendarScreen from './calendar';

export default function MainScreen() {
  const [activeTab, setActiveTab] = useState('home');
  const [streak, setStreak] = useState(0);
  const router = useRouter();

  const handleTabPress = (tab: string) => {
    setActiveTab(tab);
  };

  useEffect(() => {
    const fetchActivity = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('activity_logs')
        .select('date, was_active')
        .eq('user_id', user.id)
        .order('date', { ascending: false })
        .limit(7);

      if (error) {
        console.error('Error fetching activity logs:', error);
        return;
      }

      const activityLog = data
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .map(entry => entry.was_active);

      let streakCount = 0;
      for (let i = activityLog.length - 1; i >= 0; i--) {
        if (activityLog[i]) {
          streakCount++;
        } else {
          break;
        }
      }

      setStreak(streakCount);
    };

    fetchActivity();
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {activeTab === 'home' ? (
          <>
            <View style={styles.headerRow}>
              <Text style={styles.header}>Today</Text>
              <Ionicons name="person-circle" size={36} color="#3C2A3E" />
            </View>

            {/* Streak */}
            <View style={styles.streakCard}>
              <View style={styles.streakTopRow}>
                <FontAwesome5 name="fire" size={20} color="#43274F" />
                <Text style={styles.streakCount}>{streak}</Text>
                <Text style={styles.streakLabel}>day streak</Text>
              </View>
              <View style={styles.dayTracker}>
                {[...Array(7)].map((_, i) => (
                  <View key={i} style={[styles.dot, i < streak && styles.dotFilled]} />
                ))}
              </View>
            </View>

            {/* Feature Cards */}
            <View style={styles.cardRow}>
              <TouchableOpacity style={styles.featureCard} onPress={() => router.push('/home/watertrack')}>
                <MaterialCommunityIcons name="water-outline" size={24} color="#3C2A3E" />
                <Text style={styles.featureTitle}>Water Tracking</Text>
                <Text style={styles.featureDesc}>Track your daily water intake</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.featureCard}
                onPress={() => router.push('/home/recipes')}
              >
                <MaterialCommunityIcons name="silverware-fork-knife" size={24} color="#3C2A3E" />
                <Text style={styles.featureTitle}>New Recipes</Text>
                <Text style={styles.featureDesc}>Check out new recipes if you need inspiration</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.featureCard}
                onPress={() => router.push('/home/pantry')}
                >
                <MaterialCommunityIcons name="fridge-outline" size={24} color="#3C2A3E" />
                <Text style={styles.featureTitle}>The Pantry</Text>
                <Text style={styles.featureDesc}>Log what you ate today</Text>
                </TouchableOpacity>
            </View>

            {/* Calories */}
            <View style={styles.caloriesCard}>
              <View style={styles.calorieRow}>
                <Text style={styles.eatenTitle}>Eaten</Text>
                <Text style={styles.remainingTitle}>Remaining</Text>
              </View>
              <View style={styles.calorieRow}>
                <Text style={styles.kcalText}>200 kcal</Text>
                <Text style={styles.kcalText}>1457</Text>
              </View>
              <View style={styles.barBackground}>
                <View style={[styles.barFill, { width: '12%' }]} />
              </View>
            </View>

            {/* Macros */}
            <View style={styles.macroCard}>
              <Text style={styles.macroTitle}>Nutritions</Text>
              <View style={styles.macroRow}>
                <Text style={styles.macroLabel}>Carb 55%</Text>
                <View style={styles.barBackground}>
                  <View style={[styles.barFill, { width: '55%', backgroundColor: '#F8DE74' }]} />
                </View>
                <Text style={styles.gramText}>109 / 198 g</Text>
              </View>
              <View style={styles.macroRow}>
                <Text style={styles.macroLabel}>Fat 26%</Text>
                <View style={styles.barBackground}>
                  <View style={[styles.barFill, { width: '26%', backgroundColor: '#A9D2A1' }]} />
                </View>
                <Text style={styles.gramText}>13.5 / 52 g</Text>
              </View>
              <View style={styles.macroRow}>
                <Text style={styles.macroLabel}>Protein 28%</Text>
                <View style={styles.barBackground}>
                  <View style={[styles.barFill, { width: '28%', backgroundColor: '#A4C3FF' }]} />
                </View>
                <Text style={styles.gramText}>34.2 / 122 g</Text>
              </View>
            </View>
          </>
        ) : activeTab === 'stats' ? (
          <PredictionScreen />
        ) : activeTab === 'calendar' ? (
          <CalendarScreen />
        ) : activeTab === 'settings' ? (
          <SettingsScreen />
        ) : (
          <Text style={styles.header}>This section is under construction</Text>
        )}
      </ScrollView>

      <BottomNavbar activeTab={activeTab} onTabPress={handleTabPress} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF4E9' },
  scrollContent: { padding: 24, paddingBottom: 100 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  header: { fontSize: 24, fontWeight: 'bold', color: '#3C2A3E' },
  streakCard: {
    backgroundColor: '#F8C9A0',
    padding: 16,
    borderRadius: 12,
    marginVertical: 20,
  },
  streakTopRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  streakCount: { fontWeight: 'bold', color: '#43274F' },
  streakLabel: { color: '#3C2A3E' },
  dayTracker: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  dot: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#DDD' },
  dotFilled: { backgroundColor: '#43274F' },
  cardRow: { flexDirection: 'row', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 },
  featureCard: {
    backgroundColor: '#E5D4D2',
    borderRadius: 10,
    padding: 12,
    width: '30%',
    alignItems: 'center',
  },
  featureTitle: { fontWeight: 'bold', fontSize: 12, color: '#3C2A3E', marginTop: 4, textAlign: 'center' },
  featureDesc: { fontSize: 10, color: '#444', textAlign: 'center', marginTop: 4 },
  caloriesCard: {
    backgroundColor: '#F5B898',
    borderRadius: 12,
    padding: 16,
    marginVertical: 20,
  },
  calorieRow: { flexDirection: 'row', justifyContent: 'space-between' },
  eatenTitle: { color: '#fff', fontWeight: 'bold' },
  remainingTitle: { color: '#fff', fontWeight: 'bold' },
  kcalText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  barBackground: {
    backgroundColor: '#FFF',
    height: 6,
    borderRadius: 3,
    marginTop: 6,
    width: '100%',
  },
  barFill: {
    backgroundColor: '#E76F51',
    height: 6,
    borderRadius: 3,
  },
  macroCard: {
    backgroundColor: '#EBDDD4',
    borderRadius: 12,
    padding: 16,
  },
  macroTitle: { fontWeight: 'bold', color: '#43274F', marginBottom: 12 },
  macroRow: { marginBottom: 12 },
  macroLabel: { fontSize: 12, fontWeight: '600', color: '#3C2A3E' },
  gramText: { fontSize: 10, textAlign: 'right', color: '#444' },
});
