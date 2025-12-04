import { supabase } from '@/lib/supabase';
import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import EditableField from '@/components/settings/EditableField';
import GoalSelector from '@/components/settings/GoalSelector';

export default function SettingsScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [streak, setStreak] = useState(0);
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        console.error('Error fetching user:', authError);
        return;
      }

      setUserEmail(user.email || '');

      // Fetch profile
      const { data: profileData, error: profileError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (profileError) {
        console.error('Error fetching profile:', profileError);
        setLoading(false);
        return;
      }

      setProfile(profileData);

      // Fetch streak
      const { data: activityData } = await supabase
        .from('activity_logs')
        .select('date, was_active')
        .eq('user_id', user.id)
        .order('date', { ascending: false })
        .limit(7);

      if (activityData) {
        const activityLog = activityData
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
      }

      setLoading(false);
    } catch (error) {
      console.error('Error fetching user data:', error);
      setLoading(false);
    }
  };

  const handleUpdate = async (field: string, value: any) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { error } = await supabase
      .from('user_profiles')
      .update({ [field]: value })
      .eq('user_id', user.id);

    if (error) {
      console.error(`Error updating ${field}:`, error);
      return false;
    }

    // Update local state
    setProfile((prev: any) => ({ ...prev, [field]: value }));
    return true;
  };

  const confirmLogout = () => {
    if (Platform.OS === 'web') {
      handleLogout();
      return;
    }

    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', style: 'destructive', onPress: handleLogout },
      ]
    );
  };

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        throw error;
      }
      // Navigate back to the login screen after logout
      router.replace('/(tabs)');
    } catch (err: any) {
      Alert.alert('Logout failed', err.message ?? 'Please try again.');
    }
  };

  const handleChangePassword = async () => {
    if (!userEmail) {
      Alert.alert('Error', 'Email not found');
      return;
    }

    // Get the Supabase project URL for redirect
    const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
    const redirectTo = Platform.OS === 'web' && typeof window !== 'undefined'
      ? `${window.location.origin}/reset-password`
      : `${supabaseUrl}/reset-password`;

    const { error } = await supabase.auth.resetPasswordForEmail(userEmail, {
      redirectTo,
    });

    if (error) {
      Alert.alert('Error', error.message);
    } else {
      Alert.alert('Success', 'Password reset email sent! Check your inbox.');
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#43274F" />
        <Text style={styles.loadingText}>Loading settings...</Text>
      </View>
    );
  }

  if (!profile) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>No profile data found</Text>
      </View>
    );
  }

  const parsedWeight = typeof profile.weight === 'number' ? profile.weight : parseFloat(profile.weight) || 0;
  const parsedIdealWeight = typeof profile.ideal_weight_kg === 'number' ? profile.ideal_weight_kg : parseFloat(profile.ideal_weight_kg) || 0;
  const weightDiff = parsedWeight - parsedIdealWeight;
  const weightDiffLbs = Math.round(weightDiff * 2.205);

  const safeGender = typeof profile.gender === 'string' && profile.gender ? profile.gender.toLowerCase() : 'female';
  const maintenanceCalories = safeGender === 'male' ? 2500 : 2000;
  const deficit = profile.activity_level === 'high' ? 600 : profile.activity_level === 'moderate' ? 500 : 300;
  const dailyCalorieGoal = maintenanceCalories - deficit;

  return (
    <View style={styles.container}>
      {/* Profile Header */}
      <View style={styles.profileHeader}>
        <View style={styles.avatarContainer}>
          <Ionicons name="person-circle" size={80} color="#43274F" />
        </View>
        <Text style={styles.profileName}>{profile.name || 'User'}</Text>
        <Text style={styles.profileEmail}>{userEmail}</Text>
      </View>

      {/* Quick Stats Card */}
      <View style={styles.statsCard}>
        <Text style={styles.sectionTitle}>Quick Stats</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <FontAwesome5 name="fire" size={20} color="#43274F" />
            <Text style={styles.statValue}>{streak}</Text>
            <Text style={styles.statLabel}>Day Streak</Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="scale" size={20} color="#43274F" />
            <Text style={styles.statValue}>
              {weightDiffLbs > 0 ? `-${weightDiffLbs}` : weightDiffLbs < 0 ? `+${Math.abs(weightDiffLbs)}` : '0'} lb
            </Text>
            <Text style={styles.statLabel}>To Goal</Text>
          </View>
          <View style={styles.statItem}>
            <FontAwesome5 name="fire" size={20} color="#43274F" />
            <Text style={styles.statValue}>{dailyCalorieGoal}</Text>
            <Text style={styles.statLabel}>Daily kcal</Text>
          </View>
        </View>
      </View>

      {/* Personal Information */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Personal Information</Text>
        <View style={styles.card}>
          <EditableField
            label="Name"
            value={profile.name || ''}
            onSave={(value) => handleUpdate('name', value)}
            type="text"
          />
          <View style={styles.divider} />
          <EditableField
            label="Age"
            value={profile.age?.toString() || ''}
            onSave={(value) => handleUpdate('age', parseInt(value))}
            type="number"
          />
          <View style={styles.divider} />
          <EditableField
            label="Gender"
            value={profile.gender || ''}
            onSave={(value) => handleUpdate('gender', value)}
            type="select"
            options={['female', 'male', 'other']}
          />
          <View style={styles.divider} />
          <EditableField
            label="Height"
            value={profile.height?.toString() || ''}
            onSave={(value) => handleUpdate('height', parseFloat(value))}
            type="height"
            unit="cm"
          />
          <View style={styles.divider} />
          <EditableField
            label="Current Weight"
            value={parsedWeight?.toString() || ''}
            onSave={(value) => handleUpdate('weight', parseFloat(value))}
            type="weight"
            unit="kg"
          />
          <View style={styles.divider} />
          <EditableField
            label="Ideal Weight"
            value={parsedIdealWeight?.toString() || ''}
            onSave={(value) => handleUpdate('ideal_weight_kg', parseFloat(value))}
            type="weight"
            unit="kg"
          />
        </View>
      </View>

      {/* Goals & Preferences */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Goals & Preferences</Text>
        <View style={styles.card}>
          <GoalSelector
            label="Food Goal"
            value={profile.food_goal || 'healthy'}
            onSave={(value) => handleUpdate('food_goal', value)}
            options={[
              { value: 'lose', label: 'Lose Weight', icon: 'weight' },
              { value: 'healthy', label: 'Stay Healthy', icon: 'apple-alt' },
              { value: 'gain', label: 'Gain Weight', icon: 'dumbbell' },
            ]}
          />
          <View style={styles.divider} />
          <GoalSelector
            label="Activity Level"
            value={profile.activity_level || 'moderate'}
            onSave={(value) => handleUpdate('activity_level', value)}
            options={[
              { value: 'low', label: 'Not Very Active' },
              { value: 'moderate', label: 'Moderately Active' },
              { value: 'high', label: 'Very Active' },
            ]}
          />
          <View style={styles.divider} />
          <GoalSelector
            label="Diet Type"
            value={profile.diet_type || 'clean'}
            onSave={(value) => handleUpdate('diet_type', value)}
            options={[
              { value: 'clean', label: 'Clean Eating' },
              { value: 'mediterranean', label: 'Mediterranean' },
              { value: 'keto', label: 'Keto' },
              { value: 'lowcarb', label: 'Low Carb' },
            ]}
          />
          <View style={styles.divider} />
          <EditableField
            label="Water Goal"
            value={profile.water_goal?.toString() || '8'}
            onSave={(value) => handleUpdate('water_goal', parseInt(value))}
            type="number"
            min={1}
            max={20}
          />
        </View>
      </View>

      {/* Account Settings */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>
        <View style={styles.card}>
          <View style={styles.accountItem}>
            <Text style={styles.accountLabel}>Email</Text>
            <Text style={styles.accountValue}>{userEmail}</Text>
          </View>
          <View style={styles.divider} />
          <TouchableOpacity style={styles.accountButton} onPress={handleChangePassword}>
            <Text style={styles.accountButtonText}>Change Password</Text>
            <Ionicons name="chevron-forward" size={20} color="#43274F" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Logout Button */}
            <TouchableOpacity style={styles.logoutButton} onPress={confirmLogout}>
        <Ionicons name="log-out-outline" size={20} color="#fff" />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: '#FFF4E9',
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
  profileHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatarContainer: {
    marginBottom: 12,
  },
  profileName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#3C2A3E',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: '#666',
  },
  statsCard: {
    backgroundColor: '#F8C9A0',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#3C2A3E',
    marginBottom: 12,
  },
  card: {
    backgroundColor: '#EBDDD4',
    borderRadius: 12,
    padding: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 12,
  },
  statItem: {
    alignItems: 'center',
    gap: 4,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#43274F',
  },
  statLabel: {
    fontSize: 12,
    color: '#3C2A3E',
  },
  divider: {
    height: 1,
    backgroundColor: '#D3CCC8',
    marginVertical: 12,
  },
  accountItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  accountLabel: {
    fontSize: 16,
    color: '#3C2A3E',
    fontWeight: '500',
  },
  accountValue: {
    fontSize: 16,
    color: '#666',
  },
  accountButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  accountButtonText: {
    fontSize: 16,
    color: '#43274F',
    fontWeight: '500',
  },
  logoutButton: {
    flexDirection: 'row',
    backgroundColor: '#E76F51',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 24,
    marginBottom: 40,
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

