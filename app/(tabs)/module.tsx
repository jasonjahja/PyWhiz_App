import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  Image,
} from "react-native";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { db, auth } from "@/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "expo-router";
import Icon from "react-native-vector-icons/Ionicons";
import StretchedCourseCard from "@/components/ui/StretchedCourseCards";
import imageMapping from "../imagemapping";

type Course = {
  id: string;
  thumbnail: any;
  title: string;
  progress: number;
  category: string;
  totalVideos: number;
  watchedVideos: number;
  description: string;
  videos: any;
};

type LastOpenedModule = {
  lastOpenedModule: string;
};

export default function ModuleOverview() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [userId, setUserId] = useState<string | null>(null);
  const [lastOpenedModule, setLastOpenedModule] = useState<any | null>(null);
  const [lastOpenedModuleData, setLastOpenedModuleData] = useState<any | null>(
    null
  );
  const router = useRouter();

  const getImage = (fileName: string) => {
    if (imageMapping[fileName]) {
      return imageMapping[fileName];
    }
    console.error(`Video file not found: ${fileName}`);
    return null;
  };

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
        const fetchedCourses = await Promise.all(
          querySnapshot.docs.map(async (docSnap) => {
          const courseData = docSnap.data() as Omit<
            Course,
            "id" | "watchedVideos" | "progress"
          >;

          let watchedVideos = 0;
          let quizCompleted = false;

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
              quizCompleted = userProgressData.quizCompleted || false;
              console.log("Watched videos:", watchedVideos);
              console.log("Quiz completed:", quizCompleted);
            } else {
              console.log(
                `No progress found for user "${userId}" in module "${docSnap.id}".`
              );
            }

            // last opened module data
            const userLastOpenedModuleRef = doc(db, "user_progress", userId);
            const userLastOpenedModuleSnap = await getDoc(
              userLastOpenedModuleRef
            );

            const lastOpenedModule = userLastOpenedModuleSnap.data();

            console.log(
              "user last opened module",
              userLastOpenedModuleSnap.data()
            );

            if (userLastOpenedModuleSnap.exists()) {
              const data = userLastOpenedModuleSnap.data();
              setLastOpenedModule(data);

              // get the data of the last opened module
              console.log(
                "last opened module",
                lastOpenedModule?.lastOpenedModule
              );
              const lastOpenedModuleRef = doc(
                db,
                "module",
                lastOpenedModule?.lastOpenedModule
              );
              const lastOpenedModuleSnap = await getDoc(lastOpenedModuleRef);

              if (lastOpenedModuleSnap.exists()) {
                setLastOpenedModuleData(lastOpenedModuleSnap.data());              
              }
            }
          }

          const videoProgress =
            courseData.totalVideos > 0
              ? (watchedVideos / courseData.totalVideos) * 90
              : 0;
            const quizProgress = quizCompleted ? 10 : 0;
            const totalProgress = Math.round(videoProgress + quizProgress);

          return{
            id: docSnap.id,
            ...courseData,
            watchedVideos,
            progress: totalProgress,
          };
        })
      );

          setCourses(fetchedCourses);

          if (selectedCategory === "All") {
            setFilteredCourses(fetchedCourses);
          } else {
            setFilteredCourses(
              fetchedCourses.filter(
                (course) => course.category === selectedCategory
              )
            );
          }
      } catch (error) {
        console.error("Error fetching courses or progress:", error);
      }
    };

    if (userId) {
      fetchCoursesWithProgress();
    }
  }, [userId]);

  // Filter courses by category
  const handleCategorySelect = (category: string) => {
    if (category == "All") {
      setFilteredCourses(courses);
      setSelectedCategory(category);
      return;
    } else {
      setSelectedCategory(category);
      setFilteredCourses(
        courses.filter((course) => course.category === category)
      );
    }
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
          {/* Back Button */}
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.iconButton}
          >
            <Icon name="chevron-back" size={24} color="#000" />
          </TouchableOpacity>
          {/* Title */}
          <Text style={styles.title}>My Courses</Text>
          {/* Search Button */}
          <TouchableOpacity
            onPress={() => router.push("/search")}
            style={styles.iconButton}
          >
            <Icon name="search-outline" size={24} color="#000" />
          </TouchableOpacity>
        </View>

        {/* Categories Section */}
        <View style={styles.categoriesContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {["All", "Beginner", "Intermediate", "Expert"].map((category) => (
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

        {/* Hero Section */}
        <Text style={styles.aboveHeroTitle}>Latest Learned</Text>
        <TouchableOpacity
          style={styles.heroContainer}
          onPress={() =>
            router.push({
              pathname: `/modules`,
              params: { moduleId: lastOpenedModule.lastOpenedModule },
            })
          }
        >
          <View style={styles.background}>
            <Image
              source={require("@/assets/images/python-logo.png")} // Replace with your illustration path
              style={styles.illustration}
              resizeMode="contain"
            />
          </View>

          <View style={styles.heroContent}>
            <Text style={styles.heroTitle}>
              {lastOpenedModuleData
                ? lastOpenedModuleData.title
                : "Start learning now!"}
            </Text>
            <Text style={styles.heroSubtitle}>
              {lastOpenedModuleData ? lastOpenedModuleData.description : "We will help you remember your last opened module by displaying it here!"}
            </Text>
          </View>
        </TouchableOpacity>

        {/* Filtered Courses Section */}
        <View style={styles.coursesContainer}>
          {filteredCourses.map((course) => (
            <StretchedCourseCard
              key={course.id}
              onPress={() => handleCoursePress(course.id)}
              thumbnail={
                course.videos[0].url
                  ? getImage(course.videos[0].url)
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
      alignItems: "center",
      justifyContent: "center",
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
  // Header Section
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 28,
  },
  iconButton: {
    padding: 8,
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
  // Hero Section
  aboveHeroTitle: {
    marginTop: 6,
    marginLeft: 6,
    marginBottom: 12,
    fontSize: 20,
    fontWeight: "bold",
    color: "#4A4A4A",
  },
  heroContainer: {
    backgroundColor: "#F8E1DB",
    borderRadius: 12,
    overflow: "hidden",
    padding: 16,
    marginBottom: 32,
    flexDirection: "row",
    alignItems: "center",
    height: 200,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  background: {
    position: "absolute",
    top: 0,
    right: "-35%",
    bottom: 0,
    width: "100%",
    opacity: 0.5,
  },
  illustration: {
    width: "100%",
    height: "100%",
  },
  heroContent: {
    flex: 1,
  },
  heroTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  heroSubtitle: {
    fontSize: 14,
    color: "#555",
    marginBottom: 12,
    width: "65%",
  },
});
