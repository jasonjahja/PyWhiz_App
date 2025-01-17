import { ThemeProvider } from '@react-navigation/native';
import { LightTheme } from '@/themes/LightTheme';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';
import { View, StyleSheet, Image, Text } from 'react-native';

import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/firebase'; 
import { Slot } from 'expo-router'; 

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  // const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, () => {
      setAuthLoading(false); // Stop loading once the auth state is determined
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded || authLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Image
          source={require('@/assets/images/python-logo.png')}
          style={styles.logo}
        />
        <Text style={styles.loadingText}>PyWhiz</Text>
      </View>
    );
  }

  return (
    <ThemeProvider
      value={{
        ...LightTheme,
        dark: false,
      }}
    >
      <Slot />
      <StatusBar style="dark" />
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  loadingText: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
});
