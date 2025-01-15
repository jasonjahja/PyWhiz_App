import { collection, setDoc, doc } from "firebase/firestore";
import { db } from "../firebase";

interface Course {
  id: string;
  title: string;
  totalVideos: number;
  category: string;
  description: string;
}

const courses: Course[] = [
  {
    id: "1",
    title: "Module 1 - Python Print",
    totalVideos: 4,
    category: "Beginner",
    description: "This module introduces Python and its features.",
  },
  {
    id: "2",
    title: "Module 2 - Conditional",
    totalVideos: 6,
    category: "Beginner",
    description: "This module introduces Python and its features.",
  },
  {
    id: "3",
    title: "Module 3 - Loops",
    totalVideos: 4,
    category: "Beginner",
    description: "This module introduces Python and its features.",
  },
  {
    id: "4",
    title: "Module 4 - Functions",
    totalVideos: 4,
    category: "Beginner",
    description: "This module introduces Python and its features.",
  },
  {
    id: "5",
    title: "Module 5 - Advanced Loops",
    totalVideos: 6,
    category: "Intermediate",
    description: "This module introduces Python and its features.",
  },
  {
    id: "6",
    title: "Module 6 - Data Structures",
    totalVideos: 5,
    category: "Intermediate",
    description: "This module introduces Python and its features.",
  },
  {
    id: "7",
    title: "Module 7 - Algorithms",
    totalVideos: 1,
    category: "Expert",
    description: "This module introduces Python and its features.",
  },
];

// Function to upload courses to Firestore
const upload = async (): Promise<void> => {
  const coursesCollection = collection(db, "module");

  for (const course of courses) {
    try {
      // const progress = calculateProgress(course.watchedVideos, course.totalVideos);

      // Add course data
      await setDoc(doc(coursesCollection, course.id), {
        title: course.title,
        totalVideos: course.totalVideos,
        // watchedVideos: course.watchedVideos,
        // progress, // Calculated progress
        category: course.category,
        description: course.description,
      });

      // console.log(
      //     `Course "${course.title}" (Category: ${course.category}) uploaded with progress: ${progress}%`
      // );
    } catch (error) {
      console.error(`Error uploading course "${course.title}":`, error);
    }
  }
};

// Run the function
upload()
  .then(() => console.log("All courses uploaded successfully!"))
  .catch((error) => console.error("Error uploading courses:", error));
