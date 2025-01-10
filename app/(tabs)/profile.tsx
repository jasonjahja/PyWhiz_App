import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView 
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { auth } from '@/firebase';
import { updateProfile, reauthenticateWithCredential, updatePassword, EmailAuthProvider, signOut } from 'firebase/auth';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { useUser } from '@/contexts/UserContext';

export default function ProfileScreen() {
  const router = useRouter();
  // const [photoURL, setPhotoURL] = useState<string | null>(null);
  const { user, setUser } = useUser();
  const [photoURL, setPhotoURL] = useState<string | null>(user?.photoURL || '');
  const [name, setName] = useState(user?.displayName || '');
  const [email] = useState(user?.email || '');
  const [oldPassword, setOldPassword] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [oldPasswordVisible, setOldPasswordVisible] = useState(false);
  

  const handleEditPhoto = async () => {
    const user = auth.currentUser;
  
    if (!user) {
      Alert.alert('Error', 'No user is currently signed in.');
      return;
    }
  
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'We need permissions to access your gallery.');
      return;
    }
  
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'images', // Use string literal
      allowsEditing: true,
      quality: 1,
    });
  
    if (!result.canceled) {
      const selectedImageUri = result.assets[0].uri;
  
      try {
        await updateProfile(user, { photoURL: selectedImageUri });
        await user.reload();
        setUser(auth.currentUser); // Update global state
        Alert.alert('Success', 'Profile picture updated successfully!');
      } catch (error: any) {
        Alert.alert('Error', error.message || 'Failed to update profile picture.');
      }
    }
  };  
  
  
  const handleSaveChanges = async () => {
    const user = auth.currentUser;
  
    if (!user) {
      Alert.alert('Error', 'No user is currently signed in.');
      return;
    }
  
    if (!name) {
      Alert.alert('Error', 'Name cannot be empty.');
      return;
    }
  
    // If the user is trying to change the password
    if (password) {
      if (!oldPassword) {
        Alert.alert('Error', 'You must enter your old password to set a new password.');
        return;
      }
  
      try {
        // Re-authenticate the user with their old password
        const credential = EmailAuthProvider.credential(user.email!, oldPassword);
        await reauthenticateWithCredential(user, credential);
  
        // Update the password
        await updatePassword(user, password);
  
        Alert.alert('Success', 'Password updated successfully!');
      } catch (error: any) {
        Alert.alert('Error', error.message || 'Failed to update password.');
        return;
      }
    }
  
    // Update the display name
    if (user.displayName !== name) {
      try {
        await updateProfile(user, { displayName: name });
        setUser(auth.currentUser);
        Alert.alert('Success', 'Profile updated successfully!');
      } catch (error: any) {
        Alert.alert('Error', error.message || 'Failed to update profile.');
      }
    }
  
    // Reload the user to reflect the latest changes
    try {
      await user.reload();
      console.log('User reloaded:', user.displayName, user.photoURL);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to reload user data.');
    }
  };
   

  const handleLogout = () => {
    Alert.alert('Confirm Logout', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          try {
            await signOut(auth);
            setUser(null); // Clear the UserContext
            router.replace('/');
          } catch (error: any) {
            Alert.alert('Error', error.message || 'Failed to log out.');
          }
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
        <ScrollView>
            <View style={styles.content}>
                {/* Header Section */}
                <View style={styles.header}>
                  {/* Back Button */}
                  <TouchableOpacity onPress={() => router.back()} style={styles.iconButton}>
                    <Icon name="arrow-back-outline" size={24} color="#000" />
                  </TouchableOpacity>
        
                  {/* Title */}
                  <Text style={styles.title}>Profile</Text>
        
                  {/* Settings Button */}
                  <TouchableOpacity onPress={() => console.log('Settings clicked')} style={styles.iconButton}>
                    <Icon name="settings-outline" size={24} color="#000" />
                  </TouchableOpacity>
                </View>

                {/* Profile Picture */}
                <View style={styles.profilePictureContainer}>
                  <Image
                    source={
                      user?.photoURL
                        ? { uri: `${user?.photoURL}?t=${new Date().getTime()}` }
                        : require('@/assets/images/avatar-placeholder.jpg')
                    }
                    style={styles.profilePicture}
                    onError={() => setPhotoURL(null)} // Optional error handling
                  />
                  <TouchableOpacity style={styles.editPhotoButton} onPress={handleEditPhoto}>
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
                        * Input your current password below for verification to change password.
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
                            name={passwordVisible ? 'eye-off-outline' : 'eye-outline'}
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
                            name={oldPasswordVisible ? 'eye-off-outline' : 'eye-outline'}
                            size={20}
                            color="#888"
                            />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Buttons */}
                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                        <Text style={styles.logoutButtonText}>Logout</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.saveButton} onPress={handleSaveChanges}>
                        <Text style={styles.saveButtonText}>Save Changes</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    paddingHorizontal: 18,
    marginTop: 54,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 28,
  },
  iconButton: {
    padding: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4A4A4A', // Dark grayish-blue
  },
  profilePictureContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profilePicture: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: '#3178C6',
  },
  editPhotoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3178C6',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginTop: 10,
  },
  editPhotoText: {
    color: '#fff',
    fontSize: 14,
    marginLeft: 4,
  },
  form: {
    marginTop: 12,
    marginBottom: 36,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
    color: '#333',
  },
  description: {
    fontSize: 10,
    color: '#666',
    marginTop: -2,
    marginBottom: 6,
    lineHeight: 16,
    textAlign: 'left',
    fontStyle: 'italic',
  },
  input: {
    width: '100%',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 18,
    backgroundColor: '#fff',
  },
  readOnlyInput: {
    backgroundColor: '#EDEDED',
  },
  passwordContainer: {
    position: 'relative',
  },
  icon: {
    position: 'absolute',
    right: 12,
    top: '20%',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#3178C6',
    paddingVertical: 12,
    marginLeft: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  logoutButton: {
    flex: 1,
    backgroundColor: '#333',
    paddingVertical: 12,
    marginRight: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
