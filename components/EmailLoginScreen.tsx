import { AntDesign, FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Image, Text, TextInput, TouchableOpacity, View } from 'react-native';

import { supabase } from '@/supabase';
import { EmailLoginStyles as styles } from './styles/EmailLoginStyles';

const EmailLoginScreen = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

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
      <Text style={styles.logo}>Login</Text>
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

      {errorMsg !== '' && <Text style={{ color: 'red' }}>{errorMsg}</Text>}

      <TouchableOpacity onPress={handleLogin} style={styles.loginButton}>
        <Text style={styles.loginButtonText}>Log In</Text>
      </TouchableOpacity>
    </View>
  );
};

export default EmailLoginScreen;
