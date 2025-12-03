import { supabase } from '@/lib/supabase';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    Modal,
    Pressable,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

export default function WaterTrack() {
  const router = useRouter();
  const [waterGoal, setWaterGoal] = useState<number>(10);
  const [glassesDrank, setGlassesDrank] = useState<number>(0);
  const [reminder, setReminder] = useState(false);
  const [newGoal, setNewGoal] = useState(String(waterGoal));
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchWaterData = async () => {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        console.error('User fetch error:', authError);
        return;
      }

      const { data, error } = await supabase
        .from('user_profiles')
        .select('water_goal')
        .eq('user_id', user.id)
        .single();

      if (error) {
        console.error('Profile fetch error:', error.message);
        return;
      }

      setWaterGoal(data?.water_goal || 10);
      setNewGoal(String(data?.water_goal || 10));
    };

    fetchWaterData();
  }, []);

  const handleAddGlass = () => {
    if (glassesDrank < waterGoal) {
      setGlassesDrank((prev) => prev + 1);
    }
  };

  const handleRemoveGlass = () => {
    if (glassesDrank > 0) {
      setGlassesDrank((prev) => prev - 1);
    }
  };

  const handleGoalUpdate = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const parsed = parseInt(newGoal);
    if (!user || isNaN(parsed) || parsed < 1 || parsed > 20) {
      Alert.alert('Invalid goal', 'Please enter a number between 1 and 20.');
      return;
    }

    const { error } = await supabase
      .from('user_profiles')
      .update({ water_goal: parsed })
      .eq('user_id', user.id);

    if (error) {
      Alert.alert('Error', 'Could not update your water goal.');
      console.error(error.message);
    } else {
      setWaterGoal(parsed);
      setGlassesDrank(0);
      setShowModal(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity onPress={() => router.back()}>
        <Ionicons name="arrow-back-circle" size={32} color="#43274F" />
      </TouchableOpacity>

      <Text style={styles.title}>Water intake today</Text>
      <Text style={styles.subtitle}>
        <Text style={styles.count}>{glassesDrank}</Text> of{' '}
        <Text style={styles.count}>{waterGoal}</Text> glasses
      </Text>
      <Text style={styles.feedback}>
        You drank {glassesDrank}/{waterGoal} glasses. {waterGoal - glassesDrank} left to go!
      </Text>

      <View style={styles.glassRow}>
        {[...Array(waterGoal)].map((_, i) => (
          <TouchableOpacity key={i} onPress={i < glassesDrank ? handleRemoveGlass : handleAddGlass}>
            <View style={[styles.glass, i < glassesDrank && styles.filledGlass]}>
              {i >= glassesDrank && <Text style={styles.plus}>+</Text>}
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.notifLabel}>Notification</Text>
      <View style={styles.toggleRow}>
        <Switch value={reminder} onValueChange={setReminder} />
        <Text>Remind me to drink water</Text>
      </View>

      <Text style={styles.interval}>Every 30 minutes</Text>

      <View style={styles.goalBox}>
        <Text style={styles.goalText}>Daily goal: {waterGoal} glasses</Text>
        <Text style={styles.subGoal}>~1.44L (average)</Text>
      </View>

      <TouchableOpacity style={styles.changeButton} onPress={() => setShowModal(true)}>
        <Text style={styles.changeButtonText}>Change daily goal</Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={showModal}
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={{ fontWeight: 'bold', marginBottom: 12 }}>Set new daily goal</Text>
            <TextInput
              style={styles.input}
              value={newGoal}
              onChangeText={setNewGoal}
              keyboardType="number-pad"
              placeholder="e.g. 10"
            />
            <View style={{ flexDirection: 'row', gap: 12 }}>
              <Pressable style={styles.saveButton} onPress={handleGoalUpdate}>
                <Text style={styles.saveText}>Save</Text>
              </Pressable>
              <Pressable style={styles.cancelButton} onPress={() => setShowModal(false)}>
                <Text style={styles.cancelText}>Cancel</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: '#FFF4E9', padding: 24 },
  title: { fontSize: 18, fontWeight: 'bold', color: '#3C2A3E', marginTop: 24 },
  subtitle: { fontSize: 24, fontWeight: 'bold', color: '#3C2A3E', marginVertical: 8 },
  feedback: { color: '#444', marginBottom: 16 },
  count: { color: '#43274F', fontWeight: 'bold' },
  glassRow: {
    flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 24,
  },
  glass: {
    width: 40, height: 60, borderRadius: 6, borderWidth: 2,
    borderColor: '#CCC', justifyContent: 'center', alignItems: 'center', backgroundColor: '#EEE',
  },
  filledGlass: { backgroundColor: '#89CFF0', borderColor: '#7FB069' },
  plus: { fontSize: 18, color: '#888', fontWeight: 'bold' },
  notifLabel: { fontWeight: 'bold', marginBottom: 4 },
  toggleRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 },
  interval: { backgroundColor: '#DDD5D5', padding: 12, borderRadius: 8, marginBottom: 16, color: '#333' },
  goalBox: { backgroundColor: '#CFE3F2', padding: 12, borderRadius: 8, marginBottom: 20 },
  goalText: { fontWeight: 'bold', fontSize: 16 },
  subGoal: { fontSize: 12, color: '#444' },
  changeButton: { backgroundColor: '#222', padding: 12, borderRadius: 8 },
  changeButtonText: { color: '#FFF', textAlign: 'center', fontWeight: 'bold' },
  modalOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.3)' },
  modalContent: { backgroundColor: '#fff', padding: 24, borderRadius: 12, width: '80%', alignItems: 'center' },
  input: {
    width: '100%', height: 40, borderWidth: 1, borderColor: '#ccc', borderRadius: 8,
    paddingHorizontal: 12, marginBottom: 16,
  },
  saveButton: { backgroundColor: '#43274F', paddingVertical: 8, paddingHorizontal: 16, borderRadius: 8 },
  saveText: { color: '#fff', fontWeight: 'bold' },
  cancelButton: { backgroundColor: '#aaa', paddingVertical: 8, paddingHorizontal: 16, borderRadius: 8 },
  cancelText: { color: '#fff', fontWeight: 'bold' },
});