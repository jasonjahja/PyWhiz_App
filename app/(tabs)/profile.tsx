import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
  Platform,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { auth, db } from "@/firebase";
import {
  updateProfile,
  reauthenticateWithCredential,
  updatePassword,
  EmailAuthProvider,
  signOut,
} from "firebase/auth";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { doc, getDoc, setDoc } from "firebase/firestore";

export default function ProfileScreen() {
  const router = useRouter();
  const user = auth.currentUser;

  const [photoURL, setPhotoURL] = useState<string | null>("");
  const [tempPhotoURL, setTempPhotoURL] = useState<string | null>(null); // Temporary photo URL
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [oldPasswordVisible, setOldPasswordVisible] = useState(false);

  const fetchUserData = async () => {
    if (!user?.uid) return;

    try {
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const userData = userSnap.data();
        setName(userData.displayName || "");
        setPhotoURL(userData.photoURL || "");
        setEmail(userData.email || user.email || "");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [user]);

  const handleEditPhoto = async () => {
    if (!user) {
      Alert.alert("Error", "No user is currently signed in.");
      return;
    }

    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      Alert.alert("Permission Denied", "We need permissions to access your gallery.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "images",
      allowsEditing: true,
      quality: 0.1, // Reduce quality to limit file size
      base64: true, // Include Base64 string in the result
    });

    if (!result.canceled && result.assets[0].base64) {
      setTempPhotoURL(`data:image/jpeg;base64,${result.assets[0].base64}`);
    }
  };

  const handleSaveChanges = async () => {
    if (!user) {
      Alert.alert("Error", "No user is currently signed in.");
      return;
    }

    if (!name) {
      Alert.alert("Error", "Name cannot be empty.");
      return;
    }

    try {
      const userRef = doc(db, "users", user.uid);

      // Update display name
      if (user.displayName !== name) {
        await updateProfile(user, { displayName: name });
        await setDoc(userRef, { displayName: name }, { merge: true });
      }

      // Update profile picture
      if (tempPhotoURL && tempPhotoURL !== photoURL) {
        const base64PhotoURL = tempPhotoURL.replace(/^data:image\/\w+;base64,/, "");
        await setDoc(userRef, { photoURL: base64PhotoURL }, { merge: true });
        setPhotoURL(tempPhotoURL);
        setTempPhotoURL(null);
      }

      // Handle password change
      if (password) {
        if (!oldPassword) {
          Alert.alert("Error", "You must enter your old password to set a new password.");
          return;
        }

        // Re-authenticate the user with their old password
        const credential = EmailAuthProvider.credential(user.email!, oldPassword);
        await reauthenticateWithCredential(user, credential);

        // Update the password
        await updatePassword(user, password);
      }

      // Sync Firestore with any updated user data
      await fetchUserData();
      Alert.alert("Success", "Profile updated successfully!");
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to update profile.");
    }
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

  const isSaveDisabled =
    user?.displayName === name &&
    password === "" &&
    oldPassword === "" &&
    !tempPhotoURL;

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.content}>
          {/* Header Section */}
          <View style={styles.header}>
            {/* Back Button */}
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.iconButton}
            >
              <Icon name="chevron-back" size={24} color="#000" />
            </TouchableOpacity>

            {/* Title */}
            <Text style={styles.title}>Profile</Text>

            {/* Settings Button */}
            <TouchableOpacity
              onPress={() => router.push("/settings")}
              style={styles.iconButton}
            >
              <Icon name="settings-outline" size={24} color="#000" />
            </TouchableOpacity>
          </View>

          {/* Profile Picture */}
          <View style={styles.profilePictureContainer}>
            <Image
              source={
                tempPhotoURL
                  ? { uri: tempPhotoURL }
                  : photoURL
                  ? { uri: `data:image/jpeg;base64,${photoURL}` }
                  : require("@/assets/images/avatar-placeholder.jpg")
              }
              style={styles.profilePicture}
              onError={() => setTempPhotoURL(null)}
            />
            <TouchableOpacity
              style={styles.editPhotoButton}
              onPress={handleEditPhoto}
            >
              <Icon name="pencil" size={16} color="#fff" />
              <Text style={styles.editPhotoText}>Edit Photo</Text>
            </TouchableOpacity>
          </View>

          {/* Profile Form */}
          <View style={styles.form}>
            <Text style={styles.label}>Name</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Enter your name"
            />

            <Text style={styles.label}>Email</Text>
            <TextInput
              style={[styles.input, styles.readOnlyInput]}
              value={email}
              editable={false}
            />

            <Text style={styles.label}>New Password</Text>
            <Text style={styles.description}>
              * Input your current password below for verification to change
              password.
            </Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.input}
                placeholder="Enter new password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!passwordVisible}
              />
              <TouchableOpacity
                onPress={() => setPasswordVisible(!passwordVisible)}
                style={styles.icon}
              >
                <Icon
                  name={passwordVisible ? "eye-off-outline" : "eye-outline"}
                  size={20}
                  color="#888"
                />
              </TouchableOpacity>
            </View>

            <Text style={styles.label}>Old Password</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.input}
                placeholder="Enter your old password"
                value={oldPassword}
                onChangeText={setOldPassword}
                secureTextEntry={!oldPasswordVisible}
              />
              <TouchableOpacity
                onPress={() => setOldPasswordVisible(!oldPasswordVisible)}
                style={styles.icon}
              >
                <Icon
                  name={oldPasswordVisible ? "eye-off-outline" : "eye-outline"}
                  size={20}
                  color="#888"
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.logoutButton}
              onPress={handleLogout}
            >
              <Text style={styles.logoutButtonText}>Logout</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.saveButton,
                isSaveDisabled && styles.disabledButton,
              ]}
              onPress={handleSaveChanges}
              disabled={isSaveDisabled}
            >
              <Text style={styles.saveButtonText}>Save Changes</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: Platform.select({
    web: {
      flex: 1,
      backgroundColor: "#f5f5f5",
      alignItems: "center",
      justifyContent: "center",
    },
    default: {
      flex: 1,
      backgroundColor: "#f5f5f5",
    },
  }),
  content: {
    flex: 1,
    paddingHorizontal: 18,
    marginTop: 54,
    // width: 375,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 28,
  },
  iconButton: {
    padding: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#4A4A4A",
  },
  profilePictureContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  profilePicture: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: "#3178C6",
  },
  editPhotoButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#3178C6",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginTop: 10,
  },
  editPhotoText: {
    color: "#fff",
    fontSize: 14,
    marginLeft: 4,
  },
  form: {
    marginTop: 12,
    marginBottom: 36,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 4,
    color: "#333",
  },
  description: {
    fontSize: 10,
    color: "#666",
    marginTop: -2,
    marginBottom: 6,
    lineHeight: 16,
    textAlign: "left",
    fontStyle: "italic",
  },
  input: {
    width: "100%",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 18,
    backgroundColor: "#fff",
  },
  readOnlyInput: {
    backgroundColor: "#EDEDED",
  },
  passwordContainer: {
    position: "relative",
  },
  icon: {
    position: "absolute",
    right: 12,
    top: "20%",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  saveButton: {
    flex: 1,
    backgroundColor: "#3178C6",
    paddingVertical: 12,
    marginLeft: 8,
    borderRadius: 8,
    alignItems: "center",
  },
  disabledButton: {
    backgroundColor: "#CCC",
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  logoutButton: {
    flex: 1,
    backgroundColor: "#333",
    paddingVertical: 12,
    marginRight: 8,
    borderRadius: 8,
    alignItems: "center",
  },
  logoutButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
