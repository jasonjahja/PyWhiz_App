import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert } from 'react-native';
import { auth } from '@/firebase'; // Adjust the path based on your Firebase setup
import { onAuthStateChanged } from 'firebase/auth';
import { useRouter } from 'expo-router';
import Navbar from '@/components/ui/Navbar';

export default function ModulePage() {
  const [name, setName] = useState('');
  const router = useRouter();

  // Fetch the user's email from Firebase Auth
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setName(user.displayName || 'Guest'); // Set the email if the user is logged in
      } else {
        // Redirect to login if no user is logged in
        router.replace('/login');
      }
    });

    return () => unsubscribe(); // Clean up the listener
  }, []);

  const handleButtonPress = () => {
    Alert.alert('Mulai!', 'Let’s begin your learning journey.');
  };

  return (
    <View style={styles.container}>
      <Navbar />

      <View style={styles.content}>
        {/* Greeting Section */}
        <Text style={styles.greeting}>Hai, {name}</Text>

        {/* Main Heading */}
        <Text style={styles.mainTitle}>Mulai Belajar Sekarang!</Text>

        {/* Mulai Button */}
        <TouchableOpacity style={styles.button} onPress={handleButtonPress}>
          <Text style={styles.buttonText}>Mulai</Text>
        </TouchableOpacity>

        {/* Image Section */}
        <Image
          source={require('@/assets/images/group-illustration.png')} // Replace with your image path
          style={styles.image}
          resizeMode="cover"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  greeting: {
    fontSize: 20,
    fontWeight: '400',
    marginBottom: 4,
    color: '#333',
  },
  mainTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 48,
    color: '#333',
  },
  button: {
    backgroundColor: '#E0E0E0',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginBottom: 154,
  },
  buttonText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 8,
  },
});
