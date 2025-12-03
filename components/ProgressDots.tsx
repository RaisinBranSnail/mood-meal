import React from 'react';
import { StyleSheet, View } from 'react-native';

interface Props {
  currentIndex: number;
  total: number;
}

export default function ProgressDots({ currentIndex, total }: Props) {
  return (
    <View style={styles.container}>
      {Array.from({ length: total }).map((_, i) => (
        <View
          key={i}
          style={[
            styles.dot,
            i === currentIndex ? styles.active : styles.inactive,
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 8,
    alignSelf: 'center',
    marginTop: 60,
    marginBottom: 20,
  },
  dot: {
    width: 20,
    height: 6,
    borderRadius: 3,
  },
  active: {
    backgroundColor: '#A49A9A',
  },
  inactive: {
    backgroundColor: '#DDD5D5',
  },
});
