import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

type VideoCardProps = {
  title: string;
  description: string;
  duration: string;
  onPress?: () => void;
};

export default function VideoCard({ title, description, duration, onPress }: VideoCardProps) {
    const [isPlayed, setIsPlayed] = useState(false);
    
    const handlePress = () => {
        setIsPlayed(true); // Mark video as played
        if (onPress) onPress(); // Trigger external onPress callback
    };

    return (
    <TouchableOpacity style={styles.videoItem} onPress={handlePress}>
      <View style={styles.thumbnail} />
      <View style={styles.videoInfo}>
        <Text style={styles.videoTitle}>{title}</Text>
        <Text style={styles.videoDescription} numberOfLines={2}>
          {description}
        </Text>
        <View style={styles.videoFooter}>
          <Icon name="time-outline" size={12} color="#666" style={styles.footerIcon} />
          <Text style={styles.videoDurationText}>{duration}</Text>
        </View>
      </View>
      <View style={styles.videoStatus}>
        <Icon
          name={isPlayed ? 'checkmark-outline' : 'play-outline'} // Toggle between play and checkmark
          size={16}
          color="#fff"
        />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  videoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 10,
    borderColor: '#ccc',
    borderWidth: 0.5,
  },
  thumbnail: {
    width: 80,
    height: 80,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
  },
  videoInfo: {
    flex: 1,
    marginHorizontal: 14,
    textAlign: 'justify',
  },
  videoTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  videoDescription: {
    fontSize: 12,
    color: '#666',
  },
  videoFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  footerIcon: {
    marginRight: 4,
  },
  videoDurationText: {
    fontSize: 10,
    color: '#666',
  },
  videoStatus: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#ccc',
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 2,
  },
});
