import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

type CourseCardProps = {
  image: any; // Course image
  category: string; // Course category
  title: string; // Course title
  duration: number; // Course duration
  users: number; // Number of users
  onPress: () => void; // Function to handle card press
};

const CourseCard: React.FC<CourseCardProps> = ({ image, category, title, duration, users, onPress }) => {
  const getCategoryStyle = () => {
    switch (category) {
      case 'Beginner':
        return { backgroundColor: '#E0F7FA', textColor: '#3178C6' };
      case 'Intermediate':
        return { backgroundColor: '#FFF3CD', textColor: '#856404' };
      case 'Expert':
        return { backgroundColor: '#F8D7DA', textColor: '#842029' };
      default:
        return { backgroundColor: '#E0E0E0', textColor: '#333' };
    }
  };
  
  const categoryStyle = getCategoryStyle();

  return (
    <TouchableOpacity style={styles.courseCard} onPress={onPress}>
      <Image source={image} style={styles.courseImage} />
      <View style={[styles.courseCategory, { backgroundColor: categoryStyle.backgroundColor }]}>
        <Text style={[styles.courseCategoryText, { color: categoryStyle.textColor }]}>
          {category}
        </Text>
      </View>
      <Text style={styles.courseTitle}>{title}</Text>
      <View style={styles.courseFooter}>
        <View style={styles.footerItem}>
          <Icon name="time-outline" size={16} color="#888" style={styles.footerIcon} />
          <Text style={styles.courseDuration}>{duration} Min</Text>
        </View>
        <View style={styles.footerItem}>
          <Icon name="people-outline" size={16} color="#888" style={styles.footerIcon} />
          <Text style={styles.courseUsers}>{users} Users</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  courseCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    width: '100%',
  },
  courseImage: {
    width: '100%',
    height: 120,
    borderRadius: 8,
    marginBottom: 12,
  },
  courseCategory: {
    backgroundColor: '#E0F7FA',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  courseCategoryText: {
    color: '#3178C6',
    fontWeight: '600',
    fontSize: 12,
  },
  courseTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  courseFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  footerIcon: {
    marginRight: 4,
  },
  courseDuration: {
    fontSize: 14,
    color: '#888',
  },
  courseUsers: {
    fontSize: 14,
    color: '#888',
  },
});

export default CourseCard;
