import React, { useState, useRef } from 'react';
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Animated,
  Dimensions,
  Text,
} from 'react-native';
import { Link } from 'expo-router';
import { ThemedText } from '../ThemedText'; // Adjust import path
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/firebase'; // Adjust path to your firebase configuration
import Icon from 'react-native-vector-icons/Ionicons';
import { useRouter } from 'expo-router';

const { width, height } = Dimensions.get('window'); // Get screen dimensions

export default function Navbar() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const slideAnim = useRef(new Animated.Value(width)).current; // Sidebar starts off-screen
  const router = useRouter();

  // Listen to Firebase authentication state
  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user);
    });

    return () => unsubscribe();
  }, []);

  const toggleSidebar = () => {
    if (sidebarVisible) {
      Animated.timing(slideAnim, {
        toValue: width, 
        duration: 300,
        useNativeDriver: true,
      }).start(() => setSidebarVisible(false));
    } else {
      Animated.timing(slideAnim, {
        toValue: 0, 
        duration: 300,
        useNativeDriver: true,
      }).start(() => setSidebarVisible(true));
    }
  };

  return (
    <View>
      {/* Navbar */}
      <View style={styles.navbar}>
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
        {isAuthenticated ? (
          // Hamburger Icon for Authenticated User
          <TouchableOpacity onPress={toggleSidebar} style={styles.iconContainer}>
            <Icon name="menu-outline" size={28} color="#333" />
          </TouchableOpacity>
        ) : (
          // Login Button for Unauthenticated User
          <Link href="/login" asChild>
            <TouchableOpacity style={styles.signInButton} accessibilityLabel="Sign In">
              <ThemedText style={styles.signInText}>Login</ThemedText>
            </TouchableOpacity>
          </Link>
        )}
      </View>

      {/* Sidebar */}
      {sidebarVisible && (
        <Animated.View style={[styles.sidebar, { transform: [{ translateX: slideAnim }] }]}>
          <TouchableOpacity onPress={toggleSidebar} style={styles.closeButton}>
            <Icon name="close-outline" size={28} color="#fff" />
          </TouchableOpacity>
          <View style={styles.sidebarContent}>
            <Link href="/home" asChild>
              <TouchableOpacity onPress={toggleSidebar}>
                <Text style={styles.sidebarItem}>Home</Text>
              </TouchableOpacity>
            </Link>
            <Link href="/module" asChild>
              <TouchableOpacity onPress={toggleSidebar}>
                <Text style={styles.sidebarItem}>Module</Text>
              </TouchableOpacity>
            </Link>
            <Link href="/profile" asChild>
              <TouchableOpacity onPress={toggleSidebar}>
                <Text style={styles.sidebarItem}>Profile</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </Animated.View>
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
  iconContainer: {
    padding: 10,
  },
  sidebar: {
    position: 'absolute',
    top: 30,
    bottom: 0,
    right: 0,
    width: '65%',
    backgroundColor: '#333',
    padding: 24,
    zIndex: 2000,
    height: height,
  },
  closeButton: {
    alignSelf: 'flex-end',
    padding: 10,
  },
  sidebarContent: {
    marginTop: 20,
  },
  sidebarItem: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 18,
  },
});
