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
    totalVideos: 2,
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
    totalVideos: 1,
    category: "Intermediate",
    description: "This module introduces Python and its features.",
  },
  {
    id: "6",
    title: "Module 6 - Data Structures",
    totalVideos: 3,
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

// upload quiz

const submitMultipleQuizQuestions = async () => {
  const quizzes = {
    "1": {
      question:
        "What is the output of the following code? print('Hello, World!')",
      options: ["Hello, World!", "Error", "Nothing", "Syntax Error"],
      correctAnswerIndex: 0,
    },
    "2": {
      question: "What does this code output?\n\tif 3 < 5:\n\t\tprint('Yes')",
      options: ["Error", "Yes", "No", "Nothing"],
      correctAnswerIndex: 1,
    },
    "3": {
      question: "What does this code output?\n\tfor i in range(2):\n\t\tprint(i)",
      options: ["0\n1", "1\n2", "0\n1\n2", "Error"],
      correctAnswerIndex: 0,
    },
    "4": {
      question: "What does this code output?\n\tdef greet():\n\t\tprint('Hello')\n\tgreet()",
      options: ["Nothing", "Error", "Hello", "Hello World"],
      correctAnswerIndex: 2,
    },
    "5": {
      question: "What does this code output?\n\tfor i in range(2):\n\t\tfor j in range(2):\n\t\t\tprint(i, j)",
      options: ['0 0\n0 1\n1 0\n1 1', '0 0\n1 1\n2 2', 'Error'],
      correctAnswerIndex: 0,
    },
    "6": {
      question: "What is the correct way to access the value of 'name' in this dictionary?\n\tmy_dict = {'name': 'Alice', 'age': 25}",
      options: ['my_dict.name', 'my_dict["name"]', 'my_dict->name'],
      correctAnswerIndex: 1,
    },
    "7": {
      question: "What is the purpose of the bubble sort algorithm?",
      options: ['To search for an element', 'To merge two lists', 'To sort a list'],
      correctAnswerIndex: 1,
    },
  };

  try {
    const quizCollection = collection(db, "quizzes");
    const batch = Object.entries(quizzes).map(([id, quiz]) => {
      const quizRef = doc(quizCollection, id); // Use the key as the document ID
      return setDoc(quizRef, quiz);
    });

    await Promise.all(batch);
    console.log("All quiz questions submitted successfully!");
  } catch (error) {
    console.error("Error submitting quiz questions:", error);
  }
};

// Run the function
submitMultipleQuizQuestions();
