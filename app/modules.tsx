import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from "react-native";
import { useRouter, useGlobalSearchParams } from "expo-router";
import { doc, getDoc, updateDoc, setDoc } from "firebase/firestore";
import { db } from "@/firebase";
import { getAuth } from "firebase/auth";
import { useVideoPlayer, VideoView } from "expo-video";
import Icon from "react-native-vector-icons/Ionicons";
import VideoCard from "@/components/ui/VideoCard";
import videoMapping from "./videomapping";
import imageMapping from "./imagemapping";

export default function ModuleDetails() {
  const router = useRouter();
  const { moduleId } = useGlobalSearchParams();
  const [moduleData, setModuleData] = useState<any>(null);
  const [watchedVideos, setWatchedVideos] = useState<number[]>([]);
  const [quizCompleted, setQuizCompleted] = useState<boolean>(false);
  const [userId, setUserId] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [currentVideo, setCurrentVideo] = useState<any>(null);
  const [currentVideoDetails, setCurrentVideoDetails] = useState<any>(null);

  const player = useVideoPlayer(currentVideo, (player) => {
    player.loop = true;
  });

  const getVideoSource = (fileName: string) => {
    if (videoMapping[fileName]) {
      return videoMapping[fileName];
    }
    console.error(`Video file not found: ${fileName}`);
    return null;
  };

  const getImage = (fileName: string) => {
    if (imageMapping[fileName]) {
      return imageMapping[fileName];
    }
    console.error(`Image file not found: ${fileName}`);
    return null;
  };

  useEffect(() => {
    const fetchModuleData = async () => {
      if (!moduleId) {
        console.error("Module ID is missing.");
        setLoading(false);
        return;
      }

      try {
        // Fetch module data
        const moduleRef = doc(db, "module", moduleId as string);
        const moduleSnap = await getDoc(moduleRef);

        if (moduleSnap.exists()) {
          const data = moduleSnap.data();
          setModuleData(data);
          setCurrentVideo(getVideoSource(data.videos[0]?.url) || null); // Set the first video as default
          setCurrentVideoDetails(data.videos[0] || null);
        } else {
          console.error(`Module with ID "${moduleId}" not found.`);
        }

        setUserId(getAuth().currentUser?.uid || ""); // Replace with authenticated user ID

        // Fetch user's watched videos
        const progressRef = doc(
          db,
          "user_module_progress",
          `${userId}_${moduleId}`
        );
        const progressSnap = await getDoc(progressRef);

        if (progressSnap.exists()) {
          const progressData = progressSnap.data();
          setWatchedVideos(progressData.watchedVideos || []);
          setQuizCompleted(progressData.quizCompleted || false);
        } else {
          // Initialize progress if it doesn't exist
          await setDoc(progressRef, {
            userId,
            moduleId,
            watchedVideos: [],
            quizCompleted: false,
          });
        }

        // update user last opened module
        try {
          const userProgressRef = doc(db, "user_progress", userId);
          const userProgressSnap = await getDoc(userProgressRef);

          console.log(userProgressSnap.data());

          if (!userProgressSnap.exists()) {
            await setDoc(doc(db, "user_progress", userId), {
              lastOpenedModule: moduleId,
            });
            console.log("Created User progress", userId, moduleId);
          } else {
            await updateDoc(doc(db, "user_progress", userId), {
              lastOpenedModule: moduleId,
            });
            console.log("Updated User progress", userId, moduleId);
          }
        } catch (e) {
          console.log("Error updating user last opened module", e);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchModuleData();
  }, [moduleId, userId]);

  const markVideoAsWatched = async (videoId: number) => {
    if (watchedVideos.includes(videoId)) {
      return; 
    }

    const progressRef = doc(
      db,
      "user_module_progress",
      `${userId}_${moduleId}`
    );

    const updatedWatchedVideos = [...watchedVideos, videoId]; // Add videoId to the watched list

    try {
      await updateDoc(progressRef, {
        watchedVideos: updatedWatchedVideos,
      });
      setWatchedVideos(updatedWatchedVideos);
      console.log(`Video ${videoId} marked as watched.`);
    } catch (error) {
      console.error("Error updating watched videos:", error);
    }
  };

  const markQuizAsCompleted = async () => {
    if (quizCompleted) {
      console.log("Quiz is already marked as completed.");
      return;
    }

    const progressRef = doc(
      db,
      "user_module_progress",
      `${userId}_${moduleId}`
    );

    try {
      await updateDoc(progressRef, { quizCompleted: true });
      setQuizCompleted(true);
      console.log("Quiz marked as completed.");
    } catch (error) {
      console.error("Error marking quiz as completed:", error);
    }
  };

  if (loading) {
    return (
      <View>
        <Text>Loading module details...</Text>
      </View>
    );
  }

  if (!moduleData) {
    return (
      <View>
        <Text>Module data not available. Please try again later.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Video Player Section */}
        <View style={styles.videoContainer}>
          <VideoView
            style={styles.video}
            player={player}
            allowsFullscreen
            allowsPictureInPicture
          />

          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Icon name="chevron-back" size={24} color="#000" />
          </TouchableOpacity>
        </View>

        {/* Module Info */}
        <View style={styles.moduleInfo}>
          <Text style={styles.moduleTitle}>
            {moduleData.title || "Module Title"}
          </Text>
          <Text style={styles.videoTitle}>
            {currentVideoDetails.title || "Video Title"}
          </Text>
          <Text style={styles.moduleDescription}>
            {currentVideoDetails.description || "No description available."}
          </Text>
        </View>

        {/* Other Videos Section */}
        <View style={styles.otherVideos}>
          <View style={styles.otherVideosHeader}>
            <Text style={styles.sectionTitle}>Other Videos</Text>
            <Text style={styles.videoDuration}>
              {moduleData.videos.length} Videos
            </Text>
          </View>

          <View style={styles.line} />

          {/* Video List */}
          {moduleData.videos.map((video: any, index: number) => {
            const videoSource = getVideoSource(video.url);
            return (
              <VideoCard
                key={index}
                title={video.title || "Untitled Video"}
                description={video.description || "Video description here."}
                duration={video.duration || "--:--"}
                isWatched={watchedVideos.includes(video.id)}
                onPress={() => {
                  setCurrentVideo(videoSource);
                  setCurrentVideoDetails(video);
                  markVideoAsWatched(video.id); // Only mark video as watched
                }}
                thumbnail={getImage(video.url)}
              />
            );
          })}
        </View>
      </ScrollView>

      {/* Fixed Quiz Button */}
      <TouchableOpacity
        onPress={() => {
          markQuizAsCompleted();
          router.push({
            pathname: `/quiz`,
            params: { moduleId: `${moduleId}` },
          });
        }}
        disabled={watchedVideos.length < (moduleData.videos?.length || 0)} 
        style={[
          styles.quizButton,
          watchedVideos.length < (moduleData.videos?.length || 0) && styles.disabledButton,
        ]}
      >
        <Text style={styles.quizButtonText}>
          {watchedVideos.length < (moduleData.videos?.length || 0)
            ? "Watch All Videos to Access Quiz"
            : quizCompleted 
            ? "Retake Quiz!" 
            : "Take A Quiz!"}
        </Text>
      </TouchableOpacity>
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
  scrollView: Platform.select({
    web: {
      flex: 1,
      paddingHorizontal: 18,
      marginTop: 48,
      width: 375,
    },
    default: {
      flex: 1,
      paddingHorizontal: 18,
      marginTop: 48,
    },
  }),
  backButton: {
    position: "absolute",
    top: 14,
    left: 14,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
  },
  videoContainer: {
    borderRadius: 12,
    aspectRatio: 11 / 10,
    backgroundColor: "#f0f0f0",
    position: "relative",
    overflow: "hidden",
  },
  video: {
    flex: 1,
  },
  moduleInfo: {
    paddingVertical: 28,
    paddingHorizontal: 2,
  },
  moduleTitle: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#888",
    marginBottom: 2,
  },
  videoTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  moduleDescription: {
    fontSize: 14,
    lineHeight: 20,
    color: "#666",
    textAlign: "justify",
  },
  otherVideos: {
    paddingVertical: 12,
    paddingHorizontal: 2,
    marginBottom: 98,
  },
  otherVideosHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  videoDuration: {
    fontSize: 12,
    color: "#666",
    marginTop: 8,
  },
  line: {
    backgroundColor: "#ccc",
    width: "100%",
    height: 3,
    borderRadius: 10,
    marginTop: 8,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 1,
  },
  quizButton: Platform.select({
    web: {
      // position: "absolute",
      bottom: 10,
      left: 0,
      right: 0,
      backgroundColor: "#3178C6",
      padding: 16,
      margin: 16,
      alignItems: "center",
      borderRadius: 12,
      width: 375,
    },
    default: {
      position: "absolute",
      bottom: 10,
      left: 0,
      right: 0,
      backgroundColor: "#3178C6",
      padding: 16,
      margin: 16,
      alignItems: "center",
      borderRadius: 12,
    },
  }),
  disabledButton: {
    backgroundColor: "#CCC",
  },
  quizButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
});
