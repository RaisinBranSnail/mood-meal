import { Platform, StyleSheet, View } from 'react-native';
import { ReactNode } from 'react';

interface MobileViewportProps {
  children: ReactNode;
}

export default function MobileViewport({ children }: MobileViewportProps) {
  // Only apply mobile viewport wrapper on web
  if (Platform.OS !== 'web') {
    return <>{children}</>;
  }

  return (
    <View nativeID="moodmeal-container" style={styles.webContainer}>
      <View nativeID="moodmeal-wrapper" style={styles.mobileWrapper}>
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  webContainer: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: '#FFF4E9',
    alignItems: 'center',
    justifyContent: 'center',
    // @ts-ignore - web-only style
    minHeight: '100vh',
    // @ts-ignore - web-only style
    overflow: 'hidden',
  },
  mobileWrapper: {
    width: 414, // iPhone 11 width
    height: 896, // iPhone 11 height
    maxWidth: '100%',
    maxHeight: '100vh',
    backgroundColor: '#FFF4E9',
    // @ts-ignore - web-only style
    boxShadow: '0 0 30px rgba(0, 0, 0, 0.15)',
    // @ts-ignore - web-only style
    overflow: 'auto',
    // @ts-ignore - web-only style
    position: 'relative',
  },
});

