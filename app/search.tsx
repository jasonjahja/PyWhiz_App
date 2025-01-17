import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  StyleSheet,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import Icon from "react-native-vector-icons/Ionicons";
import { collection, getDocs } from "firebase/firestore";
import { db, auth } from "@/firebase";
import { onAuthStateChanged } from "firebase/auth";
import imageMapping from "./imagemapping";

interface Course {
  id: string;
  thumbnail: string;
  title: string;
  progress: number;
  category: string;
  videos: any;
}

export default function SearchScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<Course[]>([]);
  const [allCourses, setAllCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  const getImage = (fileName: string) => {
    if (imageMapping[fileName]) {
      return imageMapping[fileName];
    }
    console.error(`Video file not found: ${fileName}`);
    return null;
  };

  const getCategoryStyle = (category: string) => {
    switch (category) {
      case "Beginner":
        return { textColor: "#3178C6" };
      case "Intermediate":
        return { textColor: "#856404" };
      case "Expert":
        return { textColor: "#842029" };
      default:
        return { textColor: "#333" };
    }
  };

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

  // Fetch all courses and watchedVideos from Firestore on mount
  useEffect(() => {
    const fetchCoursesAndProgress = async () => {
      if (!userId) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);

        // Fetch courses
        const coursesSnapshot = await getDocs(collection(db, "module"));
        const coursesData = coursesSnapshot.docs.map((doc) => ({
          id: doc.id,
          thumbnail: doc.data().thumbnail || "",
          title: doc.data().title || "Untitled",
          category: doc.data().category || "Uncategorized",
          totalVideos: doc.data().totalVideos || 0,
          videos: doc.data().videos || [],
        }));

        // Fetch user's progress data
        const userProgressSnapshot = await getDocs(
          collection(db, "user_module_progress")
        );
        const userProgressMap: Record<
          string,
          { watchedVideos: number[]; quizCompleted: boolean }
        > = {};
        userProgressSnapshot.docs.forEach((doc) => {
          const data = doc.data();
          if (data.userId === userId) {
            userProgressMap[data.moduleId] = {
              watchedVideos: data.watchedVideos || [],
              quizCompleted: data.quizCompleted || false,
            };
          }
        });

        // Combine course and progress data
        const combinedCourses = coursesData.map((course) => {
          const progressData = userProgressMap[course.id] || {
            watchedVideos: [],
            quizCompleted: false,
          };
          const watchedVideos = Array.isArray(progressData.watchedVideos)
            ? progressData.watchedVideos.length
            : 0;
          const videoProgress =
            course.totalVideos > 0
              ? (watchedVideos / course.totalVideos) * 90
              : 0;
          const quizProgress = progressData.quizCompleted ? 10 : 0;
          const totalProgress = Math.round(videoProgress + quizProgress);

          return {
            id: course.id,
            thumbnail: course.videos[0]?.url || "",
            title: course.title,
            category: course.category,
            videos: `${watchedVideos}/${course.totalVideos} Videos`,
            progress: totalProgress,
          };
        });

        setAllCourses(combinedCourses);
        setResults(combinedCourses);
      } catch (error) {
        console.error("Error fetching courses or progress:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCoursesAndProgress();
  }, [userId]);

  // Debounced search to optimize performance
  const handleSearch = (text: string) => {
    setSearchQuery(text);
    const filtered = allCourses.filter((item) =>
      item.title.toLowerCase().includes(text.toLowerCase())
    );
    setResults(filtered);
  };

  const renderSearchResult = ({ item }: { item: Course }) => {
    const { textColor } = getCategoryStyle(item.category);
    return (
      <TouchableOpacity
        style={styles.resultItem}
        onPress={() =>
          router.push({
            pathname: `/modules`,
            params: { moduleId: `${item.id}` },
          })
        } // Navigate to course page
      >
        <Image source={getImage(item.thumbnail)} style={styles.resultImage} />
        <View style={styles.resultText}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.details}>{item.category}</Text>
          <Text style={[styles.details, { color: textColor }]}>
            {item.videos}
          </Text>
        </View>
        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>{item.progress}%</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Search Header */}
      <View style={styles.searchContainer}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Icon name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <View style={styles.searchBar}>
          <TextInput
            value={searchQuery}
            onChangeText={handleSearch}
            placeholder="Search for courses"
            style={styles.searchInput}
          />
          <TouchableOpacity style={styles.searchButton}>
            <Icon name="search" size={20} color="#888" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Search Results */}
      <Text style={styles.sectionTitle}>
        {searchQuery ? "Search Results" : "All Courses"}
      </Text>

      {isLoading ? (
        <Text style={styles.loadingText}>Loading courses...</Text>
      ) : (
        <FlatList
          data={results}
          renderItem={renderSearchResult}
          keyExtractor={(item) => item.id}
          style={styles.resultsList}
          ListEmptyComponent={
            <Text style={styles.emptyText}>
              {searchQuery ? "No results found" : "No courses available"}
            </Text>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: Platform.select({
    web: {
      flex: 1,
      backgroundColor: "#fff",
      paddingTop: 54,
      justifyContent: "center",
      alignItems: "center",
    },
    default: {
      flex: 1,
      backgroundColor: "#fff",
      paddingTop: 54,
    },
  }),
  widthcontainer: Platform.select({
    web: {
      width: 375,
      justifyContent: "center",
      alignItems: "center",
    },
    default: {
      width: "100%",
      justifyContent: "center",
      alignItems: "center",
    },
  }),
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  backButton: {
    marginRight: 12,
  },
  searchBar: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    borderRadius: 100,
    paddingHorizontal: 16,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
  },
  searchButton: {
    padding: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 16,
    marginTop: 16,
    marginBottom: 8,
  },
  resultsList: {
    flex: 1,
    paddingHorizontal: 8,
  },
  resultItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  resultImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 14,
  },
  resultText: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "500",
    color: "#000",
  },
  details: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
  },
  progressContainer: {
    justifyContent: "center",
    alignItems: "flex-end",
  },
  progressText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#3178C6",
  },
  emptyText: {
    textAlign: "center",
    fontSize: 16,
    color: "#888",
    marginTop: 20,
  },
  loadingText: {
    textAlign: "center",
    fontSize: 16,
    color: "#888",
    marginTop: 20,
  },
});
