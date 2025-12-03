import React, { useEffect, useRef } from 'react';
import {
    Animated,
    Easing,
    StyleSheet,
    Text,
    View
} from 'react-native';

export default function Calculating() {
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 4000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const rotateInterpolate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      <Animated.Image
        source={require('@/assets/images/gloryholeMike.png')}
        style={[styles.image, { transform: [{ rotate: rotateInterpolate }] }]}
      />
      <Text style={styles.text}>Calculating...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF4E9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 120,
    height: 120,
  },
  text: {
    marginTop: 24,
    fontSize: 20,
    fontWeight: 'bold',
    color: '#43274F',
  },
});
