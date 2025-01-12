import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { collection, getDocs } from 'firebase/firestore';
import { db, auth } from '@/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { useRouter } from 'expo-router';
import StretchedCourseCard from '@/components/ui/StretchedCourseCards';

type Course = {
  id: string;
  thumbnail: any;
  title: string;
  progress: number;
  category: string;
  watchedVideos: number;
};

const ModuleOverview: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('Beginner');
  const router = useRouter();

  // Fetch Courses from Firestore
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'module'));
        const fetchedCourses: Course[] = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<Course, 'id'>),
        }));
        setCourses(fetchedCourses);
        setFilteredCourses(
            fetchedCourses.filter((course) => course.category === selectedCategory)
        );
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    };

    fetchCourses();
  }, []);

  // Filter Courses by Category
  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    setFilteredCourses(courses.filter((course) => course.category === category));
  };

  // Navigate to Specific Module
  const handleCoursePress = (courseId: string) => {
    router.push(`../modules/${courseId}`);
  };

  return (
      <View style={styles.container}>
        <ScrollView style={styles.scrollContainer}>
          {/* Header Section */}
          <View style={styles.header}>
            <Text style={styles.title}>Courses</Text>
          </View>

          {/* Categories Section */}
          <View style={styles.categoriesContainer}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {['Beginner', 'Intermediate', 'Expert'].map((category) => (
                  <TouchableOpacity
                      key={category}
                      style={[
                        styles.categoryButton,
                        selectedCategory === category ? styles.blueCategory : styles.grayCategory,
                      ]}
                      onPress={() => handleCategorySelect(category)}
                  >
                    <Text style={styles.categoryText}>{category}</Text>
                  </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Filtered Courses Section */}
          <View style={styles.coursesContainer}>
            {filteredCourses.map((course) => (
                <StretchedCourseCard
                    key={course.id}
                    onPress={() => handleCoursePress(course.id)}
                    thumbnail={
                      course.thumbnail
                          ? { uri: course.thumbnail }
                          : require('@/assets/images/python-logo.png')
                    }
                    title={course.title}
                    progress={course.progress}
                    category={course.category}
                    videos={course.watchedVideos}
                />
            ))}
          </View>
        </ScrollView>
      </View>
  );
};

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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 28,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4A4A4A',
  },
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
});

export default ModuleOverview;
