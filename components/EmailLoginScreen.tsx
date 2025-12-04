import { AntDesign, FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ScrollView,
  useWindowDimensions,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

import { supabase } from '@/lib/supabase';
import { EmailLoginStyles as styles } from './styles/EmailLoginStyles';

const EmailLoginScreen = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const { width } = useWindowDimensions();
  const imageSize = Math.min(Math.max(width * 0.45, 140), 220);

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      console.error('Login error:', error.message);
      setErrorMsg('Invalid credentials. Please try again.');
    } else {
      console.log('Logged in successfully!');
      router.replace('/home/main');
    }
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1, width: '100%' }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.logo}>Login</Text>
          <View style={[styles.imageContainer, { width: imageSize, height: imageSize }]}>
            <Image
              source={require('@/assets/moodmeal-bowl.png')}
              style={styles.image}
            />
          </View>
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

          {errorMsg !== '' && <Text style={{ color: 'red' }}>{errorMsg}</Text>}

          <TouchableOpacity onPress={handleLogin} style={styles.loginButton}>
            <Text style={styles.loginButtonText}>Log In</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default EmailLoginScreen;
