import React from 'react';
import { Platform } from 'react-native';
import { Stack } from 'expo-router';

import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function Layout() {
  const colorScheme = useColorScheme();

  return (
    <Stack
      screenOptions={{
        headerShown: false, // Hide headers globally
        contentStyle: {
          backgroundColor: Colors[colorScheme ?? 'light'].background, // Apply theme background color
        },
        cardStyle: Platform.select({
          ios: {
            backgroundColor: 'transparent',
          },
          default: {
            backgroundColor: Colors[colorScheme ?? 'light'].background,
          },
        }),
      }}
    >
      {/* Define individual screens */}
      <Stack.Screen name="home" options={{ title: 'Home' }} />
      <Stack.Screen name="profile" options={{ title: 'Profile' }} />
    </Stack>
  );
}
