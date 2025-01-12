import { collection, setDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';

// Define a type for course data
interface Course {
    id: string;
    title: string;
    totalVideos: number;
    watchedVideos: number;
    category: string;
}

// Example courses with dynamic progress
const courses: Course[] = [
    {
        id: '1',
        title: 'Module 1 - Python Print',
        totalVideos: 4,
        watchedVideos: 2,
        category: 'Beginner',
    },
    {
        id: '2',
        title: 'Module 2 - Conditional',
        totalVideos: 4,
        watchedVideos: 1,
        category: 'Beginner',
    },
    {
        id: '3',
        title: 'Module 3 - Loops',
        totalVideos: 4,
        watchedVideos: 0,
        category: 'Beginner',
    },
    {
        id: '4',
        title: 'Module 4 - Functions',
        totalVideos: 4,
        watchedVideos: 3,
        category: 'Beginner',
    },
    {
        id: '5',
        title: 'Module 5 - Advanced Loops',
        totalVideos: 6,
        watchedVideos: 4,
        category: 'Intermediate',
    },
    {
        id: '6',
        title: 'Module 6 - Data Structures',
        totalVideos: 5,
        watchedVideos: 2,
        category: 'Intermediate',
    },
    {
        id: '7',
        title: 'Module 7 - Algorithms',
        totalVideos: 7,
        watchedVideos: 0,
        category: 'Expert',
    },
];

// Function to calculate progress
const calculateProgress = (watchedVideos: number, totalVideos: number): number => {
    if (totalVideos === 0) return 0;
    return Math.round((watchedVideos / totalVideos) * 100); // Return percentage progress
};

// Function to upload courses to Firestore
const upload = async (): Promise<void> => {
    const coursesCollection = collection(db, 'module');

    for (const course of courses) {
        try {
            const progress = calculateProgress(course.watchedVideos, course.totalVideos);

            // Add course data with calculated progress
            await setDoc(doc(coursesCollection, course.id), {
                title: course.title,
                totalVideos: course.totalVideos,
                watchedVideos: course.watchedVideos,
                progress, // Calculated progress
                category: course.category, // Preserving category
            });

            console.log(
                `Course "${course.title}" (Category: ${course.category}) uploaded with progress: ${progress}%`
            );
        } catch (error) {
            console.error(`Error uploading course "${course.title}":`, error);
        }
    }
};

// Run the function
upload()
    .then(() => console.log('All courses uploaded successfully!'))
    .catch((error) => console.error('Error uploading courses:', error));