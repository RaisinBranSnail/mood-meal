//CongratsScreenStyles.ts
//leave comment above

import { StyleSheet } from 'react-native';
export const CongratsScreenStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#FDF4E7',
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 24,
    },
    image: {
      width: 150,
      height: 150,
      marginBottom: 40,
    },
    title: {
      fontSize: 28,
      fontWeight: 'bold',
      color: '#3B2D4D',
      marginBottom: 8,
    },
    subtitle: {
      color: '#3B2D4D',
      marginBottom: 40,
      fontSize: 14,
    },
    button: {
      backgroundColor: '#3B2D4D',
      paddingVertical: 12,
      paddingHorizontal: 32,
      borderRadius: 8,
    },
    buttonText: {
      color: '#FDF4E7',
      fontWeight: 'bold',
      fontSize: 16,
    },
  });
  