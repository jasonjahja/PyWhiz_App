import { Tabs } from "expo-router";
import React from "react";
import { Platform } from "react-native";

import { HapticTab } from "@/components/HapticTab";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { Colors } from "@/constants/Colors";
import { LightTheme } from "@/themes/LightTheme";
import Icon from "react-native-vector-icons/Ionicons";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.light.tint, // Explicitly use light tint
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            backgroundColor: LightTheme.colors.background, // Match LightTheme
            position: "absolute",
          },
          android: {
            backgroundColor: LightTheme.colors.background,
            elevation: 5,
          },
          web: {
            alignItems: "center",
            justifyContent: "center",
          },
          default: {},
        }),
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) => (
            <Icon
              size={28}
              name={focused ? "home" : "home-outline"}
              color={color}
            />
          ),
          tabBarAccessibilityLabel: "Home Screen",
        }}
      />
      <Tabs.Screen
        name="module"
        options={{
          title: "Module",
          tabBarIcon: ({ color, focused }) => (
            <Icon
              size={28}
              name={focused ? "book" : "book-outline"}
              color={color}
            />
          ),
          tabBarAccessibilityLabel: "Module Screen",
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, focused }) => (
            <Icon
              size={28}
              name={focused ? "person" : "person-outline"}
              color={color}
            />
          ),
          tabBarAccessibilityLabel: "Profile Screen",
        }}
      />
    </Tabs>
  );
}
