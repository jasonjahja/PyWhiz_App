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
import Navbar from '@/components/ui/Navbar';

export default function ProfileScreen() {
  const router = useRouter();
  const [name, setName] = useState(auth.currentUser?.displayName || '');
  const [email] = useState(auth.currentUser?.email || '');
  const [oldPassword, setOldPassword] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [oldPasswordVisible, setOldPasswordVisible] = useState(false);

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
        Alert.alert('Success', 'Profile updated successfully!');
      } catch (error: any) {
        Alert.alert('Error', error.message || 'Failed to update profile.');
      }
    }
  };  

  const handleLogout = async () => {
    try {
      await signOut(auth);
      Alert.alert('Success', 'You have been logged out.');
      router.replace('/login');
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to log out.');
    }
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete your account? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              if (auth.currentUser) {
                await auth.currentUser.delete();
                Alert.alert('Account Deleted', 'Your account has been deleted.');
                router.replace('/register');
              } else {
                throw new Error('No user is currently signed in.');
              }
            } catch (error) {
              Alert.alert('Error', error.message || 'Failed to delete account.');
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
        <Navbar />
        <ScrollView>
            <View style={styles.content}>
                {/* Back Button */}
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => router.back()}
                >
                    <Icon name="arrow-back-outline" size={24} color="#000" />
                </TouchableOpacity>

                {/* Header */}
                <Text style={styles.header}>Profile</Text>

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
                        * To change your password, you must first enter your current password for verification.
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
                    <TouchableOpacity style={styles.saveButton} onPress={handleSaveChanges}>
                        <Text style={styles.saveButtonText}>Save Changes</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                        <Text style={styles.logoutButtonText}>Logout</Text>
                    </TouchableOpacity>
                </View>

                {/* Danger Zone */}
                <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={handleDeleteAccount}
                >
                    <Text style={styles.deleteButtonText}>Delete Account</Text>
                </TouchableOpacity>
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
    padding: 24,
    backgroundColor: '#f5f5f5',
    paddingTop: 118,
  },
  backButton: {
    position: 'relative',
    top: 34,
    zIndex: 1000,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  form: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
    color: '#333',
  },
  description: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
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
    marginBottom: 16,
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
    marginRight: 8,
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
    backgroundColor: '#FF6B6B',
    paddingVertical: 12,
    marginLeft: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  deleteButton: {
    backgroundColor: '#D9534F',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 24,
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
