import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Switch, TouchableOpacity } from 'react-native';
import { useVideoPlayer, VideoView } from 'expo-video';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { db, auth } from '../../firebase'; // Ensure auth is imported
import { useRouter } from 'expo-router';

const Module1: React.FC = () => {
    const router = useRouter(); // Initialize router

    const videos = [
        {
            id: 1,
            title: 'What is Python?',
            url: require('../../assets/videos/WhatIsPython.mp4'),
        },
        {
            id: 2,
            title: 'Why Learn Python?',
            url: require('../../assets/videos/WhyLearnPython.mp4'),
        },
        {
            id: 3,
            title: 'Getting Started with Python',
            url: require('../../assets/videos/GettingStarted.mp4'),
        },
        {
            id: 4,
            title: 'Python Setup',
            url: require('../../assets/videos/PythonSetup.mp4'),
        },
    ];

    const [watchedVideos, setWatchedVideos] = useState<number[]>([]);
    const [userId, setUserId] = useState<string | null>(null);
    const moduleId = '1'; // Current module ID

    // Fetch user ID when the user logs in
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUserId(user.uid);
                console.log(`Logged in as: ${user.uid}`);
            } else {
                console.log('No user logged in.');
                setUserId(null);
            }
        });

        return unsubscribe;
    }, []);

    // Fetch watchedVideos data from Firestore on page load
    useEffect(() => {
        const fetchWatchedVideos = async () => {
            if (!userId) return;

            try {
                const userProgressRef = doc(db, 'user_module_progress', `${userId}_${moduleId}`);
                const userProgressSnap = await getDoc(userProgressRef);

                if (userProgressSnap.exists()) {
                    const data = userProgressSnap.data();
                    setWatchedVideos(data.watchedVideos || []);
                    console.log(`Fetched watched videos: ${data.watchedVideos}`);
                } else {
                    console.log('No progress found for this module.');
                }
            } catch (error) {
                console.error('Error fetching watched videos:', error);
            }
        };

        fetchWatchedVideos();
    }, [userId]);

    // Update watchedVideos data in Firestore
    const updateWatchedVideosInDB = async (videoId: number, action: 'add' | 'remove') => {
        if (!userId) return;

        const userProgressRef = doc(db, 'user_module_progress', `${userId}_${moduleId}`);
        const userProgressSnap = await getDoc(userProgressRef);

        if (userProgressSnap.exists()) {
            const data = userProgressSnap.data();
            let updatedWatchedVideos = data.watchedVideos || [];

            if (action === 'add') {
                if (!updatedWatchedVideos.includes(videoId)) {
                    updatedWatchedVideos.push(videoId);
                }
            } else if (action === 'remove') {
                updatedWatchedVideos = updatedWatchedVideos.filter((id: number) => id !== videoId);
            }

            await updateDoc(userProgressRef, {
                watchedVideos: updatedWatchedVideos,
            });
            console.log(
                `Video ${videoId} ${
                    action === 'add' ? 'marked as watched' : 'removed from watched'
                } for user "${userId}".`
            );
        } else if (action === 'add') {
            await setDoc(userProgressRef, {
                userId,
                moduleId,
                watchedVideos: [videoId],
            });
            console.log(`Initialized watchedVideos for user "${userId}" with video ${videoId}.`);
        }
    };

    const toggleWatched = (videoId: number) => {
        setWatchedVideos((prev) => {
            const isCurrentlyWatched = prev.includes(videoId);

            updateWatchedVideosInDB(videoId, isCurrentlyWatched ? 'remove' : 'add').catch(
                console.error
            );

            return isCurrentlyWatched
                ? prev.filter((id) => id !== videoId)
                : [...prev, videoId];
        });
    };

    const isWatched = (videoId: number) => watchedVideos.includes(videoId);

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>Introduction to Python</Text>
            <Text style={styles.subtitle}>
                Videos Watched: {watchedVideos.length}/{videos.length}
            </Text>

            {videos.map((video) => {
                const player = useVideoPlayer(video.url, (player) => {
                    player.loop = false;
                });

                const handlePlay = () => {
                    if (!isWatched(video.id)) {
                        toggleWatched(video.id);
                    }
                    player.play();
                };

                return (
                    <View key={video.id} style={styles.videoContainer}>
                        <Text style={styles.videoTitle}>{video.title}</Text>
                        <VideoView
                            style={styles.videoPlayer}
                            player={player}
                            allowsFullscreen
                            allowsPictureInPicture
                        />
                        <TouchableOpacity style={styles.playButton} onPress={handlePlay}>
                            <Text style={styles.buttonText}>Play</Text>
                        </TouchableOpacity>
                        <View style={styles.markAsWatchedContainer}>
                            <Text style={styles.markAsWatchedText}>Mark as Watched</Text>
                            <Switch
                                value={isWatched(video.id)}
                                onValueChange={() => toggleWatched(video.id)}
                            />
                        </View>
                    </View>
                );
            })}

            <TouchableOpacity
                style={styles.nextButton}
                onPress={() => router.push('/modules/1-quiz')}
            >
                <Text style={styles.buttonText}>Go to Quiz</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 16,
        textAlign: 'center',
    },
    videoContainer: {
        marginBottom: 24,
        borderRadius: 8,
        padding: 16,
        backgroundColor: '#f9f9f9',
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    videoTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    videoPlayer: {
        width: '100%',
        height: 200,
        backgroundColor: '#000',
        borderRadius: 8,
    },
    playButton: {
        backgroundColor: '#4caf50',
        padding: 8,
        borderRadius: 8,
        marginTop: 8,
        alignItems: 'center',
    },
    nextButton: {
        backgroundColor: '#4caf50',
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 16,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    markAsWatchedContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 12,
    },
    markAsWatchedText: {
        fontSize: 16,
        fontWeight: '500',
    },
});

export default Module1;
