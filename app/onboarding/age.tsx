import { supabase } from '@/lib/supabase';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

interface Props {
  onNext: () => void;
  onBack: () => void;
}

export default function AgeScreen({ onNext, onBack }: Props) {
  const [age, setAge] = useState('');
  const [loading, setLoading] = useState(false);

  const handleNext = async () => {
    if (!age) return;
    setLoading(true);

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      console.error('❌ User not authenticated:', authError);
      setLoading(false);
      return;
    }

    // 💾 Save age to Supabase
    const { error } = await supabase
      .from('user_profiles')
      .update({ age: Number(age) })
      .eq('user_id', user.id);

    if (error) {
      console.error('❌ Error saving age to Supabase:', error);
    } else {
      console.log('✅ Age saved to Supabase');
      onNext();
    }

    setLoading(false);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Text style={styles.title}>How old are you?</Text>

      <TextInput
        style={styles.input}
        placeholder="Type your age"
        placeholderTextColor="#444"
        value={age}
        onChangeText={setAge}
        keyboardType="numeric"
      />

      <View style={styles.navContainer}>
        <TouchableOpacity style={styles.navButtonBack} onPress={onBack}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.navButtonNext,
            { backgroundColor: age ? '#43274F' : '#B9AFAF' },
          ]}
          onPress={handleNext}
          disabled={!age || loading}
        >
          <Ionicons name="arrow-forward" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF4E9',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  progressBar: {
    flexDirection: 'row',
    gap: 8,
    position: 'absolute',
    top: 60,
  },
  progressDot: {
    width: 40,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#A49A9A',
  },
  inactiveDot: {
    backgroundColor: '#DDD5D5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 32,
    color: '#3C2A3E',
  },
  input: {
    width: '100%',
    height: 50,
    borderRadius: 10,
    backgroundColor: '#D3CCC8',
    paddingHorizontal: 16,
    fontSize: 18,
    color: '#000',
  },
  navContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
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
