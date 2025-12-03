import { supabase } from '@/lib/supabase';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity
} from 'react-native';

interface Props {
  onNext: () => void;
  onBack: () => void;
}

export default function NameScreen({ onNext }: Props) {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleNext = async () => {
    if (!name) return;

    setLoading(true);

    // First try to get the session (more reliable for newly signed up users)
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    
    let user = sessionData?.session?.user;
    
    // If no session, try getUser as fallback
    if (!user) {
      const {
        data: { user: userData },
        error: authError,
      } = await supabase.auth.getUser();
      
      if (authError) {
        console.error('❌ User not authenticated', authError);
        setLoading(false);
        return;
      }
      user = userData;
    }

    if (!user) {
      console.error('❌ User not authenticated - no session or user found');
      setLoading(false);
      return;
    }

    const { error } = await supabase.from('user_profiles').insert([
      {
        user_id: user.id,
        name: name,
      },
    ]);

    if (error) {
      console.error('❌ Error saving name to Supabase:', error);
    } else {
      console.log('✅ Name saved to Supabase');
      onNext();
    }

    setLoading(false);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Text style={styles.title}>Let’s start with your name</Text>

      <TextInput
        style={styles.input}
        placeholder="Type your name"
        placeholderTextColor="#444"
        value={name}
        onChangeText={setName}
      />

      <TouchableOpacity
        style={[
          styles.nextButton,
          { backgroundColor: name ? '#43274F' : '#B9AFAF' },
        ]}
        onPress={handleNext}
        disabled={!name || loading}
      >
        <Ionicons name="arrow-forward" size={24} color="white" />
      </TouchableOpacity>
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 32,
    color: '#3C2A3E',
    textAlign: 'center',
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
  nextButton: {
    position: 'absolute',
    bottom: 40,
    right: 24,
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
