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
import Icon from 'react-native-vector-icons/Ionicons';
import StretchedCourseCard from '@/components/ui/StretchedCourseCards';

const allCourses = [
  {
    id: '1',
    thumbnail: require('@/assets/images/python-logo.png'),
    title: 'Module 1 - Python Print',
    progress: 60,
    category: 'Beginner',
    videos: 4,
  },
  {
    id: '2',
    thumbnail: require('@/assets/images/python-logo.png'),
    title: 'Module 2 - Conditional',
    progress: 10,
    category: 'Beginner',
    videos: 4,
  },
  {
    id: '3',
    thumbnail: require('@/assets/images/python-logo.png'),
    title: 'Module 3 - Loops',
    progress: 5,
    category: 'Beginner',
    videos: 4,
  },
  {
    id: '4',
    thumbnail: require('@/assets/images/python-logo.png'),
    title: 'Module 4 - Functions',
    progress: 0,
    category: 'Beginner',
    videos: 4,
  },
  {
    id: '5',
    thumbnail: require('@/assets/images/python-logo.png'),
    title: 'Module 5 - Advanced Loops',
    progress: 40,
    category: 'Intermediate',
    videos: 6,
  },
  {
    id: '6',
    thumbnail: require('@/assets/images/python-logo.png'),
    title: 'Module 6 - Data Structures',
    progress: 30,
    category: 'Intermediate',
    videos: 5,
  },
  {
    id: '7',
    thumbnail: require('@/assets/images/python-logo.png'),
    title: 'Module 7 - Algorithms',
    progress: 0,
    category: 'Expert',
    videos: 7,
  },
];

export default function HomePage() {
  const [name, setName] = useState('');
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState('Beginner'); // Track selected category
  const [filteredCourses, setFilteredCourses] = useState(
    allCourses.filter((course) => course.category === 'Beginner')
  );

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

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    setFilteredCourses(allCourses.filter((course) => course.category === category));
  };

  const handleCoursePress = (course: string) => {
    console.log('Course Pressed:', course);
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollContainer}>
        {/* Header Section */}
        <View style={styles.header}>
          {/* Back Button */}
          <TouchableOpacity onPress={() => router.back()} style={styles.iconButton}>
            <Icon name="chevron-back" size={24} color="#000" />
          </TouchableOpacity>

          {/* Title */}
          <Text style={styles.title}>My Courses</Text>

          {/* Search Button */}
          <TouchableOpacity onPress={() => router.push('/search')} style={styles.iconButton}>
            <Icon name="search-outline" size={24} color="#000" />
          </TouchableOpacity>
        </View>

        {/* Categories Section */}
        <View style={styles.categoriesContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <TouchableOpacity
              style={[
                styles.categoryButton,
                selectedCategory === 'Beginner' ? styles.blueCategory : styles.grayCategory,
              ]}
              onPress={() => handleCategorySelect('Beginner')}
            >
              <Text style={styles.categoryText}>Beginner</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.categoryButton,
                selectedCategory === 'Intermediate' ? styles.blueCategory : styles.grayCategory,
              ]}
              onPress={() => handleCategorySelect('Intermediate')}
            >
              <Text style={styles.categoryText}>Intermediate</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.categoryButton,
                selectedCategory === 'Expert' ? styles.blueCategory : styles.grayCategory,
              ]}
              onPress={() => handleCategorySelect('Expert')}
            >
              <Text style={styles.categoryText}>Expert</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        {/* Hero Section */}
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

        {/* Filtered Courses Section */}
        <View style={styles.coursesContainer}>
          {filteredCourses.map((course) => (
            <StretchedCourseCard
              key={course.id}
              onPress={() => handleCoursePress(course.title)}
              thumbnail={course.thumbnail}
              title={course.title}
              progress={course.progress}
              category={course.category}
              videos={course.videos}
            />
          ))}
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
    paddingHorizontal: 18,
    marginTop: 54,
  },
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
    color: '#4A4A4A',
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
    height: 200,
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
});
