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
import { useRouter, useGlobalSearchParams  } from 'expo-router';
import Icon from 'react-native-vector-icons/Ionicons';
import CourseCard from '@/components/ui/CourseCard';
import { useUser } from '@/contexts/UserContext';

export default function HomePage() {
  const params = useGlobalSearchParams ();
  const [name, setName] = useState(auth.currentUser?.displayName || '');
  const [photoURL, setPhotoURL] = useState<string | null>(null);
  const router = useRouter();
  const { user } = useUser();

  // useEffect(() => {
  //   const fetchUserData = async () => {
  //     const user = auth.currentUser;
  //     if (user) {
  //       await user.reload();
  //       setName(user.displayName || 'Guest');
  //       setPhotoURL(user.photoURL || null);
  //     }
  //   };

  //   if (params.reload) {
  //     fetchUserData();
  //   }
  // }, [params]);

  const handlePress = () => {
    console.log('Course card pressed');
  };


  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollContainer}>
        {/* Greeting Section */}
        {/* <Text style={styles.greeting}>Hi, {name}</Text> */}

        {/* Search Section */}
        {/* <View style={styles.searchContainer}>
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
        </View> */}

        {/* Header Section */}
        <View style={styles.header}>
          {/* Greeting Section */}
          <View style={styles.greetingContainer}>
            <Text style={styles.greetingText}>
              Hello, <Text style={styles.userName}>{user?.displayName || 'Guest'}</Text>
            </Text>
          </View>

          {/* Profile Picture with Circle Effect */}
          <View style={styles.profilePictureWrapper}>
            <View style={[styles.circleOutline, styles.mediumCircle]} />
            <View style={[styles.circleOutline, styles.largeCircle]} />
            <TouchableOpacity 
              onPress={() => router.push('/profile')}
              style={styles.profilePictureContainer}
            >
              <Image
                source={
                  photoURL
                    ? { uri: `${user?.photoURL}?t=${new Date().getTime()}` }
                    : require('@/assets/images/avatar-placeholder.jpg')
                }
                style={styles.profilePicture}
                onError={() => setPhotoURL(null)}
              />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.heroContainer}>
          {/* Background Illustration */}
          <View style={styles.background}>
            <Image
              source={require('@/assets/images/python-logo.png')} // Replace with your image path
              style={styles.illustration}
              resizeMode="contain"
            />
          </View>

          {/* Text Content */}
          <View style={styles.content}>
            <Text style={styles.title}>Find a course you want to learn</Text>

            {/* Search Input */}
            <View style={styles.searchContainer}>
              <Icon name="search" size={20} color="#888" style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search Course"
                placeholderTextColor="#aaa"
              />
            </View>
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
          <Text style={styles.sectionTitle}>Learn Our Most Popular Course</Text>
          <View style={styles.coursesRow}>
            <CourseCard
              image={require('@/assets/images/python-logo.png')} // Replace with your course image
              category='Beginner'
              title="Module 1 - Python Print"
              duration="50 Min"
              users="24 Users"
              onPress={handlePress}
            />
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
  // heading
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    marginBottom: 8,
  },
  greetingContainer: {
    flex: 1,
    paddingTop: 18,
  },
  greetingText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#4A4A4A', // Dark grayish-blue
  },
  userName: {
    fontWeight: 'bold',
    color: '#3178C6', // Accent color
  },
  profilePictureWrapper: {
    position: 'relative',
    width: 64,
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleOutline: {
    position: 'absolute',
    borderWidth: 2,
    borderColor: '#3178C6', // Circle outline color
    borderRadius: 9999,
  },
  mediumCircle: {
    width: 150,
    height: 150,
    opacity: 0.3,
  },
  largeCircle: {
    width: 240,
    height: 240,
    opacity: 0.1,
  },
  profilePictureContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    overflow: 'hidden',
    zIndex: 1,
  },
  profilePicture: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },

  // greeting: {
  //   marginTop: 136,
  //   marginBottom: 8,
  //   fontSize: 20,
  //   fontWeight: 'bold',
  //   color: '#333',
  // },
  // searchContainer: {
  //   marginBottom: 24,
  // },
  // title: {
  //   fontSize: 20,
  //   fontWeight: 'bold',
  //   marginBottom: 12,
  //   color: '#333',
  // },
  heroContainer: {
    position: 'relative',
    backgroundColor: '#E0F7F5',
    borderRadius: 16,
    padding: 20,
    overflow: 'hidden',
    marginBottom: 20,
  },
  background: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: '100%',
    height: '100%',
    zIndex: -1,
  },
  illustration: {
  width: '200%',
  height: '200%',
  position: 'absolute',
  top: '-25%',
  right: '-85%',
  opacity: 0.25,
},
  content: {
    zIndex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 24,
    paddingHorizontal: 12,
    paddingVertical: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  searchIcon: {
    marginLeft: 4,
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
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
    borderRadius: 32,
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
});
