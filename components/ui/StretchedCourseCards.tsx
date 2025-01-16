import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  GestureResponderEvent,
} from "react-native";

type StretchedCourseCardProps = {
  onPress: (event: GestureResponderEvent) => void; // Type for the onPress function
  thumbnail: any; // Type for the image source
  title: string; // Course title
  progress: number; // Progress percentage
  category: string; // Course category
  videos: number; // Videos watched info (e.g., "4/6 Video")
  totalVideo: number; // Total video count
};

const StretchedCourseCard: React.FC<StretchedCourseCardProps> = ({
  onPress,
  thumbnail,
  title,
  progress,
  category,
  videos,
  totalVideo,
}) => {
  const getCategoryStyle = () => {
    switch (category) {
      case "Beginner":
        return { backgroundColor: "#E0F7FA", textColor: "#3178C6" };
      case "Intermediate":
        return { backgroundColor: "#FFF3CD", textColor: "#856404" };
      case "Expert":
        return { backgroundColor: "#F8D7DA", textColor: "#842029" };
      default:
        return { backgroundColor: "#E0E0E0", textColor: "#333" };
    }
  };

  const categoryStyle = getCategoryStyle();

  return (
    <TouchableOpacity style={styles.stretchedCourseCard} onPress={onPress}>
      <Image
        source={thumbnail} // Thumbnail image
        style={styles.courseImage}
      />
      <View style={styles.courseContent}>
        <View
          style={[
            styles.courseCategory,
            { backgroundColor: categoryStyle.backgroundColor },
          ]}
        >
          <Text
            style={[
              styles.courseCategoryText,
              { color: categoryStyle.textColor },
            ]}
          >
            {category}
          </Text>
        </View>
        <Text style={styles.courseTitle}>{title}</Text>
        <View style={styles.courseProgress}>
          <Text style={styles.courseProgressText}>
            {videos}/{totalVideo} videos
          </Text>
          <Text style={styles.courseProgressPercentage}>{progress}%</Text>
        </View>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${progress}%` }]} />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  stretchedCourseCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginVertical: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  courseImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginLeft: 2,
    marginRight: 16,
  },
  courseContent: {
    flex: 1,
  },
  courseCategory: {
    backgroundColor: "#E0F7FA",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
    alignSelf: "flex-start",
    marginBottom: 8,
  },
  courseCategoryText: {
    color: "#3178C6",
    fontWeight: "600",
    fontSize: 12,
  },
  courseTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  courseProgress: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  courseProgressText: {
    fontSize: 12,
    color: "#666",
  },
  courseProgressPercentage: {
    fontSize: 12,
    fontWeight: "600",
    color: "#3178C6",
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
    backgroundColor: "#E0E0E0",
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#3178C6",
  },
});

export default StretchedCourseCard;
