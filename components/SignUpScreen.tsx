import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native';
import { AntDesign, FontAwesome } from '@expo/vector-icons';
import { supabase } from '@/lib/supabase';
import { EmailLoginStyles as styles } from './styles/EmailLoginStyles';

import CongratsScreen from './CongratsScreen';

const SignUpScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showCongrats, setShowCongrats] = useState(false);

  const handleSignUp = async () => {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) {
      console.error('Sign up error:', error.message);
    } else {
      // Check if user needs email confirmation
      if (data.user && !data.session) {
        // Email confirmation required - user will need to confirm email first
        console.log('Please check your email to confirm your account');
        // You might want to show a message here
      } else if (data.session) {
        // User is automatically logged in (email confirmation disabled)
        console.log('Signed up and logged in successfully');
      }
      setShowCongrats(true);
    }
  };

  if (showCongrats) {
    return <CongratsScreen onContinue={() => console.log('User continues to app')} />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>Create Account</Text>
      <Image
        source={require('@/assets/moodmeal-bowl.png')}
        style={styles.image}
      />
      <View style={styles.inputContainer}>
        <AntDesign name="mail" size={20} color="#3B2D4D" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="email"
          placeholderTextColor="#3B2D4D"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />
      </View>
      <View style={styles.inputContainer}>
        <FontAwesome name="key" size={20} color="#3B2D4D" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="password"
          placeholderTextColor="#3B2D4D"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
      </View>
      <TouchableOpacity onPress={handleSignUp} style={styles.loginButton}>
        <Text style={styles.loginButtonText}>Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SignUpScreen;