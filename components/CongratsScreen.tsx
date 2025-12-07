import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { CongratsScreenStyles as styles } from './styles/CongratsScreenStyles';

const CongratsScreen = () => {
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    // Check if user has an active session
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          setIsReady(true);
        } else {
          // Wait a bit and check again (session might be establishing)
          setTimeout(async () => {
            const { data: { session: retrySession } } = await supabase.auth.getSession();
            setIsReady(!!retrySession);
            setChecking(false);
          }, 1000);
          return;
        }
      } catch (error) {
        console.error('Error checking session:', error);
      }
      setChecking(false);
    };

    checkSession();
  }, []);

  const handleContinue = async () => {
    // Double-check session before navigating
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      router.push('/onboarding/name');
    } else {
      console.error('No session found. Please try signing in again.');
      // You might want to show an error message or redirect to login
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('@/assets/circle_guy.png')}
        style={styles.image}
        resizeMode="contain"
      />

      <Text style={styles.title}>Congrats!</Text>
      <Text style={styles.subtitle}>
        You are a new member of Dietello!
      </Text>

      {checking ? (
        <ActivityIndicator size="large" color="#43274F" style={{ marginTop: 20 }} />
      ) : (
        <TouchableOpacity
          style={[styles.button, !isReady && { opacity: 0.5 }]}
          onPress={handleContinue}
          disabled={!isReady}
        >
          <Text style={styles.buttonText}>Continue</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default CongratsScreen;
