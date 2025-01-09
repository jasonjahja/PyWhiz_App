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
import Icon from 'react-native-vector-icons/Ionicons';

export default function HomePage() {
  const [name, setName] = useState('');
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setName(user.displayName || 'Guest');
      } else {
        router.replace('/login');
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <View style={styles.container}>
      {/* <Navbar /> */}

      <ScrollView style={styles.scrollContainer}>
        {/* Search Section */}
        {/* <View style={styles.searchContainer}>
          <View style={styles.searchBox}>
            <TextInput
              placeholder="Search Course"
              style={styles.searchInput}
              placeholderTextColor="#999"
            />
            <TouchableOpacity style={styles.searchButton}>
              <Icon name="search" size={20} color="#888" style={styles.searchIcon} />
            </TouchableOpacity>
          </View>
        </View> */}

        {/* Header Section */}
        <View style={styles.header}>
          {/* Back Button */}
          <TouchableOpacity onPress={() => router.back()} style={styles.iconButton}>
            <Icon name="arrow-back-outline" size={24} color="#000" />
          </TouchableOpacity>

          {/* Title */}
          <Text style={styles.title}>My Courses</Text>

          {/* Search Button */}
          <TouchableOpacity onPress={() => console.log('Search clicked')} style={styles.iconButton}>
            <Icon name="search-outline" size={24} color="#000" />
          </TouchableOpacity>
        </View>

        {/* Categories Section */}
        <View style={styles.categoriesContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <TouchableOpacity style={[styles.categoryButton, styles.blueCategory]}>
              <Icon name="options-outline" size={20} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.categoryButton, styles.grayCategory]}>
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

        <Text style={styles.aboveHeroTitle}>Latest Learned</Text>
        <View style={styles.heroContainer}>
          {/* Background Illustration */}
          <View style={styles.background}>
            <Image
              source={require('@/assets/images/python-logo.png')} // Replace with your illustration path
              style={styles.illustration}
              resizeMode="contain"
            />
          </View>

          {/* Text Content */}
          <View style={styles.heroContent}>
            <Text style={styles.heroTitle}>Module 1 - Python print</Text>
            <Text style={styles.heroSubtitle}>Part 1 - 24 Minutes</Text>
          </View>
        </View>

        {/* Courses Section */}
        <View style={styles.coursesContainer}>
          <View style={styles.stretchedCourseCard}>
            <Image
              source={require('@/assets/images/python-logo.png')} // Replace with your course image
              style={styles.courseImage}
            />
            <View style={styles.courseContent}>
              <View style={styles.courseCategory}>
                <Text style={styles.courseCategoryText}>Beginner</Text>
              </View>
              <Text style={styles.courseTitle}>Module 1 - Python Print</Text>
              <View style={styles.courseProgress}>
                <Text style={styles.courseProgressText}>4/6 Video</Text>
                <Text style={styles.courseProgressPercentage}>60%</Text>
              </View>
              <View style={styles.progressBar}>
                <View style={styles.progressFill}></View>
              </View>
            </View>
          </View>

          <View style={styles.stretchedCourseCard}>
            <Image
              source={require('@/assets/images/python-logo.png')} // Replace with your course image
              style={styles.courseImage}
            />
            <View style={styles.courseContent}>
              <View style={styles.courseCategory}>
                <Text style={styles.courseCategoryText}>Beginner</Text>
              </View>
              <Text style={styles.courseTitle}>Module 2 - Conditional</Text>
              <View style={styles.courseProgress}>
                <Text style={styles.courseProgressText}>4/6 Video</Text>
                <Text style={styles.courseProgressPercentage}>60%</Text>
              </View>
              <View style={styles.progressBar}>
                <View style={styles.progressFill}></View>
              </View>
            </View>
          </View>

          <View style={styles.stretchedCourseCard}>
            <Image
              source={require('@/assets/images/python-logo.png')} // Replace with your course image
              style={styles.courseImage}
            />
            <View style={styles.courseContent}>
              <View style={styles.courseCategory}>
                <Text style={styles.courseCategoryText}>Beginner</Text>
              </View>
              <Text style={styles.courseTitle}>Module 3 - Loop</Text>
              <View style={styles.courseProgress}>
                <Text style={styles.courseProgressText}>4/6 Video</Text>
                <Text style={styles.courseProgressPercentage}>60%</Text>
              </View>
              <View style={styles.progressBar}>
                <View style={styles.progressFill}></View>
              </View>
            </View>
          </View>

          <View style={styles.stretchedCourseCard}>
            <Image
              source={require('@/assets/images/python-logo.png')} // Replace with your course image
              style={styles.courseImage}
            />
            <View style={styles.courseContent}>
              <View style={styles.courseCategory}>
                <Text style={styles.courseCategoryText}>Beginner</Text>
              </View>
              <Text style={styles.courseTitle}>Module 4 - Function</Text>
              <View style={styles.courseProgress}>
                <Text style={styles.courseProgressText}>4/6 Video</Text>
                <Text style={styles.courseProgressPercentage}>60%</Text>
              </View>
              <View style={styles.progressBar}>
                <View style={styles.progressFill}></View>
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
    marginTop: 54,
  },
  // searchContainer: {
  //   marginTop: 136,
  //   marginBottom: 12,
  // },
  // searchBox: {
  //   flexDirection: 'row',
  //   alignItems: 'center',
  //   backgroundColor: '#F5F5F5',
  //   borderRadius: 8,
  //   paddingHorizontal: 12,
  //   height: 50,
  // },
  // searchInput: {
  //   flex: 1,
  //   fontSize: 16,
  //   color: '#333',
  // },
  // searchButton: {
  //   marginLeft: 8,
  // },
  // searchIcon: {
  //   marginRight: 8,
  // },

  // Header Section
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
  // Categories Section
  categoriesContainer: {
    marginBottom: 18,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 36,
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
  coursesContainer: {
    marginBottom: 154,
  },
  // Hero Section
  aboveHeroTitle: {
    marginTop: 6,
    marginLeft: 6,
    marginBottom: 12,
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4A4A4A',
  },
  heroContainer: {
    backgroundColor: '#F8E1DB',
    borderRadius: 12,
    overflow: 'hidden',
    padding: 16,
    marginBottom: 32,
    flexDirection: 'row',
    alignItems: 'center',
    height: '20%',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  background: {
    position: 'absolute',
    top: 0,
    right: '-35%',
    bottom: 0,
    width: '100%',
    opacity: 0.5,
  },
  illustration: {
    width: '100%',
    height: '100%',
  },
  heroContent: {
    flex: 1,
  },
  heroTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  heroSubtitle: {
    fontSize: 14,
    color: '#555',
    marginBottom: 12,
  },
  // Stretched Course Card
  stretchedCourseCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    marginBottom: 14,
    padding: 6,
  },
  courseImage: {
    width: 80,
    height: '100%',
    marginLeft: 28,
    marginRight: 28,
  },
  courseContent: {
    padding: 4,
    width: '60%',
  },
  courseCategory: {
    alignSelf: 'flex-start',
    backgroundColor: '#3178C6',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 16,
    marginBottom: 4,
  },
  courseCategoryText: {
    fontSize: 10,
    color: '#fff',
    fontWeight: 'bold',
  },
  courseTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  courseProgress: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  courseProgressText: {
    fontSize: 10,
    color: '#777',
  },
  courseProgressPercentage: {
    fontSize: 10,
    color: '#777',
  },
  progressBar: {
    height: 6,
    backgroundColor: '#E0E0E0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    width: '60%', // Adjust width based on progress
    backgroundColor: '#3178C6',
  },
});
