import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from 'react-native';
import { auth } from '@/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { useRouter } from 'expo-router';
import Navbar from '@/components/ui/Navbar';

export default function HomePage() {
  const [name, setName] = useState('');
  const router = useRouter();

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

  return (
    <View style={styles.container}>
      <Navbar />

      <ScrollView style={styles.scrollContainer}>
        {/* Greeting Section */}
        <Text style={styles.greeting}>Hi, {name}</Text>

        {/* Search Section */}
        <View style={styles.searchContainer}>
          <Text style={styles.title}>Find a course you want to learn</Text>
          <View style={styles.searchBox}>
            <TextInput
              placeholder="Search Course"
              style={styles.searchInput}
              placeholderTextColor="#999"
            />
            <TouchableOpacity style={styles.searchButton}>
              <Image
                source={require('@/assets/images/python-logo.png')} // Replace with your search icon
                style={styles.searchIcon}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Categories Section */}
        <View style={styles.categoriesContainer}>
          <Text style={styles.sectionTitle}>Level</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <TouchableOpacity style={[styles.categoryButton, styles.blueCategory]}>
              <Text style={styles.categoryText}>Beginner</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.categoryButton, styles.grayCategory]}>
              <Text style={styles.categoryText}>Intermediate</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.categoryButton, styles.grayCategory]}>
              <Text style={styles.categoryText}>Expert</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        {/* Popular Courses Section */}
        <View style={styles.popularCoursesContainer}>
          <Text style={styles.sectionTitle}>Popular Courses</Text>
          <View style={styles.coursesRow}>
            <View style={styles.courseCard}>
              <Image
                source={require('@/assets/images/python-logo.png')} // Replace with your course image
                style={styles.courseImage}
              />
              <Text style={styles.courseTitle}>Expert Math In 20 Min</Text>
              <Text style={styles.courseAuthor}>Author by Jennifer</Text>
              <View style={styles.courseFooter}>
                <Text style={styles.courseDuration}>50 Min</Text>
                <Text style={styles.courseUsers}>24 Users</Text>
              </View>
            </View>

            <View style={styles.courseCard}>
              <Image
                source={require('@/assets/images/python-logo.png')} // Replace with your course image
                style={styles.courseImage}
              />
              <Text style={styles.courseTitle}>Intro to JS Development</Text>
              <Text style={styles.courseAuthor}>Author by Samuel</Text>
              <View style={styles.courseFooter}>
                <Text style={styles.courseDuration}>50 Min</Text>
                <Text style={styles.courseUsers}>15 Users</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  greeting: {
    marginTop: 136,
    marginBottom: 8,
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  searchContainer: {
    marginBottom: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 50,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  searchButton: {
    marginLeft: 8,
  },
  searchIcon: {
    width: 24,
    height: 24,
  },
  categoriesContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    marginRight: 8,
  },
  blueCategory: {
    backgroundColor: '#3178C6',
  },
  grayCategory: {
    backgroundColor: '#E0E0E0',
  },
  categoryText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
  },
  popularCoursesContainer: {
    marginBottom: 24,
  },
  coursesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  courseCard: {
    width: '48%',
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 12,
  },
  courseImage: {
    width: '100%',
    height: 100,
    borderRadius: 8,
    marginBottom: 8,
  },
  courseTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#333',
  },
  courseAuthor: {
    fontSize: 12,
    marginBottom: 8,
    color: '#777',
  },
  courseFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  courseDuration: {
    fontSize: 12,
    color: '#333',
  },
  courseUsers: {
    fontSize: 12,
    color: '#333',
  },
});
