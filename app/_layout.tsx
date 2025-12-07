// app/_layout.tsx
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { Platform } from 'react-native';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';
import { OnboardingDataProvider } from '@/hooks/useOnboardingData'; // ✅ added
import MobileViewport from '@/components/MobileViewport';
import WebStyles from '@/components/WebStyles';

// Inject mobile styles immediately on web before React renders
if (Platform.OS === 'web' && typeof document !== 'undefined') {
  if (!document.getElementById('dietello-mobile-styles')) {
    const style = document.createElement('style');
    style.id = 'dietello-mobile-styles';
    style.textContent = `
      * { box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
      html, body { margin: 0; padding: 0; width: 100%; height: 100%; overflow: hidden; background-color: #FFF4E9; }
      #root { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; background-color: #FFF4E9; }
      #dietello-container { width: 100%; height: 100vh; display: flex; align-items: center; justify-content: center; background-color: #FFF4E9; overflow: hidden; }
      #dietello-wrapper { width: min(414px, 100%); height: min(896px, 100vh); background-color: #FFF4E9; box-shadow: 0 0 30px rgba(0, 0, 0, 0.15); overflow: auto; position: relative; }
      * { touch-action: manipulation; }
    `;
    if (document.head.firstChild) {
      document.head.insertBefore(style, document.head.firstChild);
    } else {
      document.head.appendChild(style);
    }
  }
}

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();

  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <>
      <WebStyles />
      <MobileViewport>
        <OnboardingDataProvider> {/* ✅ wraps entire app */}
          <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
            <Stack>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="+not-found" />
            </Stack>
            <StatusBar style="auto" />
          </ThemeProvider>
        </OnboardingDataProvider>
      </MobileViewport>
    </>
  );
}
