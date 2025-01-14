import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Video } from 'expo-av';
import Icon from 'react-native-vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import VideoCard from '@/components/ui/VideoCard';

export default function ModuleDetails() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Video Player Section */}
        <View style={styles.videoContainer}>
          <Video
            style={styles.video}
            // source={{ uri: require('@/assets/videos/GettingStarted.mp4') }}
            source={{ uri: "ADD_VIDEO_URL" }}
            useNativeControls
            // resizeMode="contain"
          />
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Icon name="chevron-back" size={24} color="#000" />
          </TouchableOpacity>
        </View>

        {/* Module Info */}
        <View style={styles.moduleInfo}>
          <Text style={styles.moduleTitle}>Module 1 - Python Intro</Text>
          <Text style={styles.moduleDescription}>
            Module 1 - Python Intro Module 1 - Python Intro Module 1 - Python Intro
            Module 1 - Python Intro Module 1 - Python Intro Module 1 - Python Intro
          </Text>
        </View>

        {/* Other Videos Section */}
        <View style={styles.otherVideos}>
          <View style={styles.otherVideosHeader}>
            <Text style={styles.sectionTitle}>Other Videos</Text>
            <Text style={styles.videoDuration}>12 Videos - 2 hours</Text>
          </View>

          <View style={styles.line} />
          
          {/* Video List Items */}
          {[1, 2, 3].map((item) => (
            <VideoCard
                key={item}
                title="Judul"
                description="Module 1 - Python Intro Module 1 - Python Intro Module 1 - Intro ..."
                duration="12:34"
                onPress={() => console.log(`Video ${item} pressed`)}
            />
            ))}
        </View>
      </ScrollView>

      {/* Fixed Quiz Button */}
      <TouchableOpacity style={styles.quizButton} onPress={() => router.push('/quiz')}>
        <Text style={styles.quizButtonText}>Take A Quiz!</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 18,
    marginTop: 48,
  },
  backButton: {
    position: 'absolute',
    top: 14,
    left: 14,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  videoContainer: {
    borderRadius: 12,
    aspectRatio: 11/10,
    backgroundColor: '#f0f0f0',
    position: 'relative',
  },
  video: {
    flex: 1,
    resizeMode: 'contain',
  },
  moduleInfo: {
    paddingVertical: 28,
    paddingHorizontal: 2,
  },
  moduleTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  moduleDescription: {
    fontSize: 14,
    lineHeight: 20,
    color: '#666',
    textAlign: 'justify',
  },
  otherVideos: {
    paddingVertical: 24,
    paddingHorizontal: 2,
    marginBottom: 92,
  },
  otherVideosHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  videoDuration: {
    fontSize: 12,
    color: '#666',
    marginTop: 8,
  },
  line: {
    backgroundColor: '#ccc',
    width: '100%',
    height: 4,
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
  circle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#f0f0f0',
    marginRight: 8,
  },
  quizButton: {
    position: 'absolute',
    bottom: 10,
    left: 0,
    right: 0,
    backgroundColor: '#f0f0f0',
    padding: 16,
    margin: 16,
    alignItems: 'center',
    borderRadius: 12,
  },
  quizButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});