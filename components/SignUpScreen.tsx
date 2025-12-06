import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  useWindowDimensions,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { AntDesign, FontAwesome, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { EmailLoginStyles as styles } from './styles/EmailLoginStyles';
import CongratsScreen from './CongratsScreen';

interface SignUpScreenProps {
  onBack?: () => void;
}

const SignUpScreen = ({ onBack }: SignUpScreenProps) => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showCongrats, setShowCongrats] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const { width } = useWindowDimensions();
  const imageSize = Math.min(Math.max(width * 0.45, 140), 220);

  const handleSignUp = async () => {
    if (!email || !password) {
      setErrorMsg('Please enter both email and password');
      return;
    }

    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    const { data, error } = await supabase.auth.signUp({ email, password });
    
    if (error) {
      console.error('Sign up error:', error.message);
      setErrorMsg(error.message || 'Failed to create account. Please try again.');
      setLoading(false);
    } else {
      // Check if user needs email confirmation
      if (data.user && !data.session) {
        // Email confirmation required
        setErrorMsg('Please check your email to confirm your account');
        setLoading(false);
      } else if (data.session) {
        // User is automatically logged in (email confirmation disabled)
        console.log('Signed up and logged in successfully');
        setShowCongrats(true);
      } else {
        setShowCongrats(true);
      }
    }
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(tabs)');
    }
  };

  if (showCongrats) {
    return <CongratsScreen />;
  }

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1, width: '100%' }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Ionicons name="arrow-back" size={24} color="#FDE7CE" />
        </TouchableOpacity>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.logo}>Create Account</Text>
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
              onChangeText={(text) => {
                setEmail(text);
                setErrorMsg('');
              }}
              autoCapitalize="none"
              keyboardType="email-address"
              editable={!loading}
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
              onChangeText={(text) => {
                setPassword(text);
                setErrorMsg('');
              }}
              editable={!loading}
            />
          </View>

          {errorMsg !== '' && (
            <Text style={{ color: '#FF6B6B', fontSize: 14, marginBottom: 12, textAlign: 'center' }}>
              {errorMsg}
            </Text>
          )}

          <TouchableOpacity
            onPress={handleSignUp}
            style={[styles.loginButton, loading && { opacity: 0.6 }]}
            disabled={loading}
          >
            <Text style={styles.loginButtonText}>
              {loading ? 'Creating Account...' : 'Sign Up'}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default SignUpScreen;