import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView } from 'react-native';
import { AntDesign, FontAwesome } from '@expo/vector-icons';
import { supabase } from '@/lib/supabase';
import { LoginScreenStyles as styles } from './styles/LoginScreenStyles';
import EmailLoginScreen from './EmailLoginScreen';
import SignUpScreen from './SignUpScreen';

const MoodMealApp = () => {
  const [screen, setScreen] = useState<'login' | 'email' | 'signup'>('login');

  if (screen === 'email') return <EmailLoginScreen />;
  if (screen === 'signup') return <SignUpScreen />;

  return (
    <View style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.logo}>Moo'dMeal</Text>

        <Image
          source={require('@/assets/moodmeal-bowl.png')}
          style={styles.image}
        />

        <TouchableOpacity style={styles.button} onPress={() => setScreen('email')}>
          <AntDesign name="mail" size={20} color="#3B2D4D" />
          <Text style={styles.buttonText}>login with email</Text>
        </TouchableOpacity>

        <Text style={styles.signupText}>
          Don't have an account yet?{' '}
          <TouchableOpacity onPress={() => setScreen('signup')}>
            <Text style={styles.signupLink}>Sign up</Text>
          </TouchableOpacity>
        </Text>

        <Text style={styles.footer}>
          By continue you agree to our {'\n'}
          <Text style={styles.link}>Terms & Privacy Policy</Text>
        </Text>
      </ScrollView>
    </View>
  );
};

export default MoodMealApp;
