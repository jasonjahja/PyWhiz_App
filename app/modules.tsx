import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useRouter, useGlobalSearchParams } from "expo-router";
import { doc, getDoc, updateDoc, setDoc } from "firebase/firestore";
import { db } from "@/firebase"; // Ensure correct path to Firebase configuration
import { useVideoPlayer, VideoView } from "expo-video";
import Icon from "react-native-vector-icons/Ionicons";
import VideoCard from "@/components/ui/VideoCard";
import videoMapping from "./videomapping";

export default function ModuleDetails() {
  const router = useRouter();
  const { moduleId } = useGlobalSearchParams(); // Dynamically get moduleId from the route
  const [moduleData, setModuleData] = useState<any>(null);
  const [watchedVideos, setWatchedVideos] = useState<number[]>([]);
  const [userId, setUserId] = useState<string>("8hzRnSqWVZXH1zEIvm2Ayrps9442"); // Replace with authenticated user ID
  const [loading, setLoading] = useState(true);
  const [currentVideo, setCurrentVideo] = useState<any>(null);

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
        } else {
          console.error(`Module with ID "${moduleId}" not found.`);
        }

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
        } else {
          // Initialize progress if it doesn't exist
          await setDoc(progressRef, {
            userId,
            moduleId,
            watchedVideos: [],
          });
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchModuleData();
    console.log(moduleData);
  }, [moduleId, userId]);

  const toggleWatchedVideo = async (videoId: number) => {
    const progressRef = doc(
      db,
      "user_module_progress",
      `${userId}_${moduleId}`
    );
    const isWatched = watchedVideos.includes(videoId);

    const updatedWatchedVideos = isWatched
      ? watchedVideos.filter((id) => id !== videoId) // Remove videoId if it's currently watched
      : [...watchedVideos, videoId]; // Add videoId if it's not currently watched

    try {
      await updateDoc(progressRef, {
        watchedVideos: updatedWatchedVideos,
      });
      setWatchedVideos(updatedWatchedVideos);
      console.log(
        `Video ${videoId} ${
          isWatched ? "unmarked as watched" : "marked as watched"
        }.`
      );
    } catch (error) {
      console.error("Error updating watched videos:", error);
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
          <Text style={styles.moduleDescription}>
            {moduleData.description || "No description available."}
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
            const videoSource = getVideoSource(video.fileName);
            return (
              <VideoCard
                key={index}
                title={video.title || "Untitled Video"}
                description={video.description || "Video description here."}
                duration={video.duration || "--:--"}
                isWatched={watchedVideos.includes(video.id)}
                onPress={() => {
                  setCurrentVideo(videoSource);
                  toggleWatchedVideo(video.id); // Toggle watched status on click
                }}
              />
            );
          })}
        </View>
      </ScrollView>

      {/* Fixed Quiz Button */}
      <TouchableOpacity
        style={styles.quizButton}
        onPress={() => router.push(`/quiz`)}
      >
        <Text style={styles.quizButtonText}>Take A Quiz!</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 18,
    marginTop: 48,
  },
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
  },
  video: {
    width: "100%",
    height: 200,
    borderRadius: 12,
  },
  moduleInfo: {
    paddingVertical: 28,
    paddingHorizontal: 2,
  },
  moduleTitle: {
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
    paddingVertical: 24,
    paddingHorizontal: 2,
    marginBottom: 92,
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
    height: 4,
    borderRadius: 10,
    marginTop: 8,
    marginBottom: 14,
  },
  quizButton: {
    position: "absolute",
    bottom: 10,
    left: 0,
    right: 0,
    backgroundColor: "#f0f0f0",
    padding: 16,
    margin: 16,
    alignItems: "center",
    borderRadius: 12,
  },
  quizButtonText: {
    fontSize: 18,
    fontWeight: "bold",
  },
});
