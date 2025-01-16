import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

type VideoCardProps = {
  title: string;
  description: string;
  duration: string;
  isWatched: boolean;
  onPress?: () => void;
  thumbnail: any;
};

export default function VideoCard({
  title,
  description,
  duration,
  isWatched,
  onPress,
  thumbnail,
}: VideoCardProps) {
  return (
    <TouchableOpacity style={styles.videoItem} onPress={onPress}>
      <View style={styles.thumbnail}>
        <Image source={thumbnail} style={styles.courseImage} />
      </View>
      <View style={styles.videoInfo}>
        <Text style={styles.videoTitle}>{title}</Text>
        <Text style={styles.videoDescription} numberOfLines={2}>
          {description}
        </Text>
        <View style={styles.videoFooter}>
          <Icon
            name="time-outline"
            size={12}
            color="#666"
            style={styles.footerIcon}
          />
          <Text style={styles.videoDurationText}>{duration}</Text>
        </View>
      </View>
      <View
        style={[
          styles.videoStatus,
          { backgroundColor: isWatched ? "#3178C6" : "#333" },
          { paddingLeft: isWatched ? 0 : 2 },
        ]}
      >
        <Icon
          name={isWatched ? "checkmark-outline" : "play-outline"} // Toggle between play and checkmark
          size={16}
          color="#fff"
        />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  videoItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    backgroundColor: "white",
    padding: 10,
    borderRadius: 10,
    borderColor: "#ccc",
    borderWidth: 0.5,
  },
  thumbnail: {
    width: 80,
    height: 80,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
  },
  courseImage: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
    marginBottom: 12,
  },
  videoInfo: {
    flex: 1,
    marginHorizontal: 14,
    textAlign: "justify",
  },
  videoTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 2,
  },
  videoDescription: {
    fontSize: 12,
    color: "#666",
  },
  videoFooter: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
  },
  footerIcon: {
    marginRight: 4,
  },
  videoDurationText: {
    fontSize: 10,
    color: "#666",
  },
  videoStatus: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 8,
    alignItems: "center",
    justifyContent: "center",
  },
});
