import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
} from "react-native";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { db, auth } from "@/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "expo-router";
import StretchedCourseCard from "@/components/ui/StretchedCourseCards";

type Course = {
  id: string;
  thumbnail: any;
  title: string;
  progress: number;
  category: string;
  totalVideos: number;
  watchedVideos: number;
  description: string;
};

export default function ModuleOverview() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("Beginner");
  const [userId, setUserId] = useState<string | null>(null);
  const router = useRouter();

  // Fetch user ID from auth
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
      } else {
        setUserId(null);
      }
    });
    return unsubscribe;
  }, []);

  // Fetch courses and user progress from Firestore
  useEffect(() => {
    const fetchCoursesWithProgress = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "module"));
        const fetchedCourses: Course[] = [];

        for (const docSnap of querySnapshot.docs) {
          const courseData = docSnap.data() as Omit<
            Course,
            "id" | "watchedVideos" | "progress"
          >;

          let watchedVideos = 0;

          // Fetch user-specific progress for the module
          if (userId) {
            const userProgressRef = doc(
              db,
              "user_module_progress",
              `${userId}_${docSnap.id}`
            );
            const userProgressSnap = await getDoc(userProgressRef);

            if (userProgressSnap.exists()) {
              const userProgressData = userProgressSnap.data();
              watchedVideos = (userProgressData.watchedVideos || []).length;
              console.log("Watched videos:", watchedVideos);
            }
          }

          fetchedCourses.push({
            id: docSnap.id,
            ...courseData,
            watchedVideos,
            progress: Math.round(
              (watchedVideos / courseData.totalVideos) * 100
            ),
          });
        }

        setCourses(fetchedCourses);
        setFilteredCourses(
          fetchedCourses.filter(
            (course) => course.category === selectedCategory
          )
        );
      } catch (error) {
        console.error("Error fetching courses or progress:", error);
      }
    };

    if (userId) {
      fetchCoursesWithProgress();
    }
  }, [userId, selectedCategory]);

  // Filter courses by category
  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    setFilteredCourses(
      courses.filter((course) => course.category === category)
    );
  };

  // Navigate to specific module
  const handleCoursePress = (courseId: string) => {
    router.push({
      pathname: `/modules`,
      params: { moduleId: `${courseId}` },
    });
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
            {["Beginner", "Intermediate", "Expert"].map((category) => (
              <TouchableOpacity
                key={category}
                style={[
                  styles.categoryButton,
                  selectedCategory === category
                    ? styles.blueCategory
                    : styles.grayCategory,
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
                  : require("@/assets/images/python-logo.png")
              }
              title={course.title}
              progress={course.progress}
              category={course.category}
              videos={course.watchedVideos}
              totalVideo={course.totalVideos}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: Platform.select({
    web: {
      flex: 1,
      backgroundColor: "#fff",
      alignItems: "center", // Center the app horizontally
      justifyContent: "center", // Center the app vertically
    },
    default: {
      flex: 1,
      backgroundColor: "#fff",
    },
  }),
  scrollContainer: Platform.select({
    web: {
      flex: 1,
      paddingHorizontal: 18,
      marginTop: 54,
      width: 375,
    },
    default: {
      flex: 1,
      paddingHorizontal: 18,
      marginTop: 54,
    },
  }),
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 28,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#4A4A4A",
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
    backgroundColor: "#3178C6",
  },
  grayCategory: {
    backgroundColor: "#E0E0E0",
  },
  categoryText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#fff",
  },
  coursesContainer: {
    marginBottom: 154,
  },
});
