import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Platform,
} from "react-native";
import { useRouter, useGlobalSearchParams } from "expo-router";
import Icon from "react-native-vector-icons/Ionicons";
import CourseCard from "@/components/ui/CourseCard";
import { useUser } from "@/contexts/UserContext";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/firebase";
import imageMapping from "../imagemapping";

interface Course {
  id: string;
  image: string;
  category: string;
  title: string;
  duration: number;
  users: number;
  videos: Array<any>;
}

function convertTimeToNumber(time: string) {
  const [minutes, seconds] = time.split(":").map((time) => parseInt(time, 10));
  return Math.floor(minutes + seconds / 60);
}

export default function HomePage() {
  const router = useRouter();
  const { user } = useUser();
  const [photoURL, setPhotoURL] = useState<string | null>(user?.photoURL || "");
  const [selectedCategory, setSelectedCategory] = useState<string>("Beginner");
  const [allCourses, setAllCourses] = useState<Course[]>([]);
  const [filteredCourse, setFilteredCourse] = useState<Course | null>(null);

  const getImage = (fileName: string) => {
    if (imageMapping[fileName]) {
      return imageMapping[fileName];
    }
    console.error(`Video file not found: ${fileName}`);
    return null;
  };

  // Fetch courses from Firestore
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "module")); // Replace 'modules' with your Firestore collection name

        const fetchedCourses: Course[] = querySnapshot.docs.map((doc) => {
          const videos = doc.data().videos || []; // Get the videos array, default to an empty array if not present
          const totalDuration = videos.reduce((acc: number, video: any) => {
            return acc + (convertTimeToNumber(video.duration) || 0); // Add up the duration of each video
          }, 0); // Initial accumulator value is 0

          return {
            id: doc.id,
            image: doc.data().thumbnail || "", // Replace 'thumbnail' with your Firestore image field name
            category: doc.data().category || "Unknown",
            title: doc.data().title || "Untitled",
            duration: totalDuration, // Use the aggregated total duration
            users: doc.data().users || 0, // Replace 'users' with your Firestore users field name
            videos: doc.data().videos || [],
          };
        });

        setAllCourses(fetchedCourses);

        // Initially filter by Beginner category
        const mostPopularCourse = fetchedCourses
          .filter((course) => course.category === "Beginner")
          .sort((a, b) => b.users - a.users)[0]; // Get the most popular course in 'Beginner'
        setFilteredCourse(mostPopularCourse);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    fetchCourses();
  }, []);

  // Handle category selection
  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    const mostPopularCourse = allCourses
      .filter((course) => course.category === category)
      .sort((a, b) => b.users - a.users)[0];
    setFilteredCourse(mostPopularCourse);
  };

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
          {/* Greeting Section */}
          <View style={styles.greetingContainer}>
            <Text style={styles.greetingText}>
              Hello,{" "}
              <Text style={styles.userName}>
                {user?.displayName || "Guest"}
              </Text>
            </Text>
          </View>

          {/* Profile Picture with Circle Effect */}
          <View style={styles.profilePictureWrapper}>
            <View style={[styles.circleOutline, styles.mediumCircle]} />
            <View style={[styles.circleOutline, styles.largeCircle]} />
            <TouchableOpacity
              onPress={() => router.push("/profile")}
              style={styles.profilePictureContainer}
            >
              <Image
                source={
                  photoURL
                    ? { uri: user?.photoURL }
                    : require("@/assets/images/avatar-placeholder.jpg")
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
              source={require("@/assets/images/python-logo.png")}
              style={styles.illustration}
              resizeMode="contain"
            />
          </View>

          {/* Text Content */}
          <View style={styles.content}>
            <Text style={styles.title}>Find a course you want to learn</Text>

            {/* Search Input */}
            <TouchableOpacity
              style={styles.searchContainer}
              onPress={() => router.push("/search")}
            >
              <Icon
                name="search"
                size={20}
                color="#888"
                style={styles.searchIcon}
              />
              <Text style={styles.searchPlaceholder}>Search Course</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Categories Section */}
        <View style={styles.categoriesContainer}>
          <Text style={styles.sectionTitle}>Level</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <TouchableOpacity
              style={[
                styles.categoryButton,
                selectedCategory === "Beginner"
                  ? styles.blueCategory
                  : styles.grayCategory,
              ]}
              onPress={() => handleCategorySelect("Beginner")}
            >
              <Text style={styles.categoryText}>Beginner</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.categoryButton,
                selectedCategory === "Intermediate"
                  ? styles.blueCategory
                  : styles.grayCategory,
              ]}
              onPress={() => handleCategorySelect("Intermediate")}
            >
              <Text style={styles.categoryText}>Intermediate</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.categoryButton,
                selectedCategory === "Expert"
                  ? styles.blueCategory
                  : styles.grayCategory,
              ]}
              onPress={() => handleCategorySelect("Expert")}
            >
              <Text style={styles.categoryText}>Expert</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        {/* Popular Courses Section */}
        <View style={styles.popularCoursesContainer}>
          <Text style={styles.sectionTitle}>Learn Our Most Popular Course</Text>
          {filteredCourse ? (
            <CourseCard
              image={getImage(filteredCourse.videos[0].url)}
              category={filteredCourse.category}
              title={filteredCourse.title}
              duration={filteredCourse.duration}
              users={filteredCourse.users}
              onPress={() => handleCoursePress(filteredCourse.id)}
            />
          ) : (
            <Text style={styles.noCoursesText}>
              No courses available in this category.
            </Text>
          )}
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
      alignItems: "center",
      justifyContent: "center",
    },
    default: { flex: 1, backgroundColor: "#fff" },
  }),
  scrollContainer: Platform.select({
    web: {
      flex: 1,
      paddingHorizontal: 16,
      marginTop: 54,
      width: 375,
    },
    default: {
      flex: 1,
      paddingHorizontal: 16,
      marginTop: 54,
    },
  }),
  // Header Section
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
    fontWeight: "bold",
    color: "#4A4A4A",
  },
  userName: {
    fontWeight: "bold",
    color: "#3178C6",
  },
  profilePictureWrapper: {
    position: "relative",
    width: 64,
    height: 64,
    alignItems: "center",
    justifyContent: "center",
  },
  circleOutline: {
    position: "absolute",
    borderWidth: 3,
    borderColor: "#3178C6",
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
    overflow: "hidden",
    zIndex: 1,
  },
  profilePicture: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  heroContainer: {
    position: "relative",
    backgroundColor: "#E0F7F5",
    borderRadius: 16,
    padding: 20,
    overflow: "hidden",
    marginBottom: 20,
  },
  background: {
    position: "absolute",
    top: 0,
    right: 0,
    width: "100%",
    height: "100%",
    zIndex: -1,
  },
  illustration: {
    width: "200%",
    height: "200%",
    position: "absolute",
    top: "-25%",
    right: "-85%",
    opacity: 0.25,
  },
  content: {
    zIndex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 16,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 24,
    paddingHorizontal: 12,
    paddingVertical: 2,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  searchIcon: {
    marginLeft: 4,
    marginRight: 12,
  },
  searchPlaceholder: {
    flex: 1,
    fontSize: 16,
    color: "#aaa",
    paddingVertical: 6,
  },
  categoriesContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#333",
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 32,
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
  popularCoursesContainer: {
    marginBottom: 24,
  },
  coursesRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  noCoursesText: {
    fontSize: 14,
    color: "#888",
    textAlign: "center",
  },
});
