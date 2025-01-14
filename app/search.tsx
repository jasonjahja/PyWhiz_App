import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  StyleSheet,
} from 'react-native';
import { useRouter } from 'expo-router';
import Icon from 'react-native-vector-icons/Ionicons';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/firebase';

interface Course {
  id: string;
  thumbnail: string;
  title: string;
  progress: number;
  category: string;
  videos: string;
}

export default function SearchScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<Course[]>([]);
  const [allCourses, setAllCourses] = useState<Course[]>([]);

  // Fetch all courses from Firestore on mount
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'module'));
        const coursesData: Course[] = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          thumbnail: doc.data().thumbnail || '',
          title: doc.data().title || '',
          progress: doc.data().progress || 0,
          category: doc.data().category || '',
          videos: `${doc.data().watchedVideos || 0}/${doc.data().totalVideos || 0} Video`,
        }));
        setAllCourses(coursesData);
        setResults(coursesData);
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    };

    fetchCourses();
  }, []);

  // Filter results based on search query
  const handleSearch = (text: string) => {
    setSearchQuery(text);
    const filtered = allCourses.filter((item) =>
        item.title.toLowerCase().includes(text.toLowerCase())
    );
    setResults(filtered);
  };

  const renderSearchResult = ({ item }: { item: Course }) => (
      <TouchableOpacity
          style={styles.resultItem}
          onPress={() => router.push(`../modules/${item.id}`)} // Navigate to course page
      >
        <Image
            source={{ uri: item.thumbnail }} // Assumes `thumbnail` is a URL; adjust if local asset
            style={styles.resultImage}
        />
        <View style={styles.resultText}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.details}>{item.category}</Text>
          <Text style={styles.details}>{item.videos}</Text>
        </View>
        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>{item.progress}%</Text>
        </View>
      </TouchableOpacity>
  );

  return (
      <View style={styles.container}>
        {/* Search Header */}
        <View style={styles.searchContainer}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Icon name="chevron-back" size={24} color="#000" />
          </TouchableOpacity>
          <View style={styles.searchBar}>
            <TextInput
                value={searchQuery}
                onChangeText={handleSearch}
                placeholder="Search"
                style={styles.searchInput}
            />
            <TouchableOpacity style={styles.searchButton}>
              <Icon name="search" size={20} color="#888" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Search Results */}
        <Text style={styles.sectionTitle}>Search result</Text>

        <FlatList
            data={results}
            renderItem={renderSearchResult}
            keyExtractor={(item) => item.id}
            style={styles.resultsList}
            ListEmptyComponent={<Text style={styles.emptyText}>No results found</Text>}
        />
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 54,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  backButton: {
    marginRight: 12,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 100,
    paddingHorizontal: 16,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
    includeFontPadding: false,
  },
  searchButton: {
    padding: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 16,
    marginTop: 16,
    marginBottom: 8,
  },
  resultsList: {
    flex: 1,
    paddingHorizontal: 8,
  },
  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
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
    fontWeight: '500',
    color: '#000',
  },
  details: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  progressContainer: {
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  progressText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#3178C6',
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#888',
    marginTop: 20,
  },
});
