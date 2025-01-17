import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Switch,
  Alert,
  ScrollView,
  Platform,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { useRouter } from "expo-router";
import { auth } from "@/firebase";
import { signOut } from "firebase/auth";

export default function SettingsPage() {
  const [isDarkMode, setIsDarkMode] = useState(false); // Example toggle
  const router = useRouter();

  const handleToggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
    Alert.alert(
      "Theme Changed",
      `Dark mode is now ${!isDarkMode ? "enabled" : "disabled"}.`
    );
  };

  const showAlert = ({
    title,
    message,
    onConfirm,
    onCancel,
  }: {
    title: string;
    message: string;
    onConfirm?: () => void;
    onCancel?: () => void;
  }) => {
    if (Platform.OS === "web") {
      // Web: Use window.confirm as an alternative
      const confirmed = window.confirm(`${title}\n\n${message}`);
      if (confirmed && onConfirm) onConfirm();
      if (!confirmed && onCancel) onCancel();
    } else {
      // Mobile: Use Alert API
      Alert.alert(
        title,
        message,
        [
          { text: "Cancel", onPress: onCancel, style: "cancel" },
          { text: "OK", onPress: onConfirm },
        ],
        { cancelable: true }
      );
    }
  };

  const handleLogout = () => {
    showAlert({
      title: "Confirm Logout",
      message: "Are you sure you want to log out?",
      onConfirm: async () => {
        try {
          await signOut(auth);
          signOut(auth);
          router.replace("/");
        } catch (error: any) {
          showAlert({
            title: "Error",
            message: error.message || "Failed to log out.",
          });
        }
      },
    });
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollcontainer}>
        {/* Header */}
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.iconButton}
        >
          <Icon name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <View style={styles.header}>
          <Text style={styles.title}>Settings</Text>
        </View>

        {/* Account Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          <TouchableOpacity
            style={styles.settingItem}
            onPress={() => router.push("/profile")} // Navigate to profile page
          >
            <Icon
              name="person-outline"
              size={20}
              color="#3178C6"
              style={styles.settingIcon}
            />
            <Text style={styles.settingText}>Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.settingItem}
          >
            <Icon
              name="settings-outline"
              size={20}
              color="#3178C6"
              style={styles.settingIcon}
            />
            <Text style={styles.settingText}>Account Management</Text>
          </TouchableOpacity>
        </View>

        {/* App Preferences */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          <View style={styles.settingItem}>
            <Icon
              name="moon-outline"
              size={20}
              color="#3178C6"
              style={styles.settingIcon}
            />
            <Text style={styles.settingText}>Dark Mode</Text>
            <Switch
              value={isDarkMode}
              onValueChange={handleToggleDarkMode}
              trackColor={{ false: "#ddd", true: "#3178C6" }}
              thumbColor={isDarkMode ? "#fff" : "#f4f3f4"}
            />
          </View>
        </View>

        {/* About Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <TouchableOpacity style={styles.settingItem}>
            <Icon
              name="information-circle-outline"
              size={20}
              color="#3178C6"
              style={styles.settingIcon}
            />
            <Text style={styles.settingText}>Version 1.0.0</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.settingItem}>
            <Icon
              name="help-circle-outline"
              size={20}
              color="#3178C6"
              style={styles.settingIcon}
            />
            <Text style={styles.settingText}>Help</Text>
          </TouchableOpacity>
        </View>

        {/* Logout */}
        <View style={styles.section}>
          <TouchableOpacity style={styles.settingItem} onPress={handleLogout}>
            <Icon
              name="log-out-outline"
              size={20}
              color="#E63946"
              style={styles.settingIcon}
            />
            <Text style={[styles.settingText, { color: "#E63946" }]}>
              Logout
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: Platform.select({
    web: {
      flex: 1,
      backgroundColor: "#fff",
      justifyContent: "center",
      alignItems: "center",
    },
    default: {
      flex: 1,
      backgroundColor: "#fff",
    },
  }),
  scrollcontainer: Platform.select({
    web: {
      flex: 1,
      backgroundColor: "#fff",
      paddingHorizontal: 16,
      paddingVertical: 32,
      width: 375,
    },
    default: {
      flex: 1,
      backgroundColor: "#fff",
      paddingHorizontal: 16,
      paddingVertical: 32,
    },
  }),
  iconButton: {
    padding: 8,
    position: "absolute",
    top: 22,
    left: 2,
  },
  header: {
    marginVertical: 32,
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#4A4A4A",
    marginTop: -6,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#4A4A4A",
    marginBottom: 12,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  settingIcon: {
    marginRight: 12,
  },
  settingText: {
    fontSize: 16,
    flex: 1,
    color: "#333",
  },
});
