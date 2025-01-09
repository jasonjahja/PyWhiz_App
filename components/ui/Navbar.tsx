import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { auth } from '@/firebase'; // Adjust path to your firebase configuration
import { useRouter } from 'expo-router';
import { ThemedText } from '../ThemedText';

export default function Navbar() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [photoURL, setPhotoURL] = useState<string | null>(null); // Internal state for profile picture
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onIdTokenChanged((user) => {
      if (user) {
        setIsAuthenticated(true);
        setPhotoURL(user.photoURL || null); // Update the profile picture when it changes
      } else {
        setIsAuthenticated(false);
        setPhotoURL(null);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <View style={styles.navbar}>
      {/* Logo */}
      <TouchableOpacity
        onPress={() => {
          if (isAuthenticated) {
            router.push('/home'); // Redirect to home if authenticated
          }
        }}
        disabled={!isAuthenticated} // Disable press if not authenticated
      >
        <Image
          source={require('@/assets/images/python-logo.png')}
          style={styles.navLogo}
        />
      </TouchableOpacity>

      {/* Profile Picture or Login Button */}
      {isAuthenticated ? (
        <TouchableOpacity
          onPress={() => router.push('/profile')}
          style={styles.profileContainer}
        >
          <Image
            source={
              photoURL
                ? { uri: photoURL } // Use the user's profile picture
                : require('@/assets/images/avatar-placeholder.jpg') // Fallback to default avatar
            }
            style={styles.profilePicture}
          />
        </TouchableOpacity>
      ) : (
        // Login Button for Unauthenticated User
        <TouchableOpacity
          onPress={() => router.push('/login')}
          style={styles.signInButton}
        >
          <ThemedText style={styles.signInText}>Login</ThemedText>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  navbar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingTop: 48,
    paddingVertical: 16,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
    zIndex: 1000,
  },
  navLogo: {
    width: 54,
    height: 54,
    resizeMode: 'contain',
  },
  signInButton: {
    backgroundColor: '#3178C6',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 8,
  },
  signInText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  profileContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#3178C6',
  },
  profilePicture: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
});
