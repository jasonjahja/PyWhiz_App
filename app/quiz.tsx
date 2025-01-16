import { useRouter, useGlobalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  ScrollView,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase";

export default function QuizPage() {
  const router = useRouter();
  const { moduleId } = useGlobalSearchParams(); // Get the moduleId from the route params
  const [quizData, setQuizData] = useState<any[]>([]); // Store quiz data
  const [currentIndex, setCurrentIndex] = useState(0); // Track the current question index
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  useEffect(() => {
    const fetchQuizData = async () => {
      if (!moduleId) {
        console.error("Module ID is missing.");
        return;
      }

      try {
        const quizRef = doc(db, "quizzes", moduleId as string);
        const quizSnap = await getDoc(quizRef);

        if (quizSnap.exists()) {
          const data = quizSnap.data();
          setQuizData([data]);
        } else {
          console.error(`No quizzes found for module ID "${moduleId}".`);
        }
      } catch (error) {
        console.error("Error fetching quiz data:", error);
      }
    };

    fetchQuizData();
  }, [moduleId]);

  const handleAnswerSelect = (index: number) => {
    setSelectedAnswer(index);
    const correctIndex = quizData[currentIndex].correctAnswerIndex;
    setIsCorrect(index === correctIndex);
  };

  const handleCompletion = () => {
    // Handle quiz completion logic
    router.push({
      pathname: `/completion`,
      params: { moduleId: `${moduleId}` },
    });
  };

  const handlePreviousQuestion = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      setSelectedAnswer(null);
      setIsCorrect(null);
    }
  };

  if (quizData.length === 0) {
    return (
      <View style={styles.container}>
        <Text>Loading quizzes...</Text>
      </View>
    );
  }

  const currentQuestion = quizData[currentIndex];

  return (
    <View style={styles.container}>
      <ScrollView style={styles.widthcontainer}>
        {/* Header Section */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Icon name="arrow-back" size={20} color="#000" />
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>

          {/* Progress Section */}
          <View style={styles.progressContainer}>
            <View style={styles.progressHeader}>
              <Text style={styles.levelText}>Level 1</Text>
              <Text style={styles.progressText}>
                Question {currentIndex + 1} of {quizData.length}
              </Text>
            </View>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressIndicator,
                  { width: `${((currentIndex + 1) / quizData.length) * 100}%` },
                ]}
              />
            </View>
          </View>
        </View>

        {/* Question Section */}
        <View style={styles.card}>
          <Text style={styles.questionTitle}>{currentQuestion.question}</Text>
          <Text style={styles.questionSubtitle}>
            Choose the most accurate definition from the options below.
          </Text>
        </View>

        {/* Answer Section */}
        <View style={styles.answers}>
          {currentQuestion.options.map((answer: string, index: number) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.answerButton,
                selectedAnswer === index && isCorrect !== null
                  ? isCorrect
                    ? styles.correctAnswer
                    : styles.incorrectAnswer
                  : null,
              ]}
              onPress={() => handleAnswerSelect(index)}
              disabled={isCorrect !== null}
            >
              <Text style={styles.answerText}>
                <Text style={styles.answerIndex}>
                  {String.fromCharCode(65 + index)}.
                </Text>{" "}
                {answer}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Result Section */}
        {isCorrect !== null && (
          <View
            style={[
              styles.resultCard,
              isCorrect ? styles.resultCorrect : styles.resultIncorrect,
            ]}
          >
            <Text
              style={
                isCorrect
                  ? styles.resultTextCorrect
                  : styles.resultTextIncorrect
              }
            >
              {isCorrect
                ? "Correct! Well done!"
                : `Incorrect. The correct answer is: ${
                    currentQuestion.options[currentQuestion.correctAnswerIndex]
                  }`}
            </Text>
          </View>
        )}

        {/* Navigation Buttons */}
        <View style={styles.navigation}>
          <TouchableOpacity
            style={[
              styles.navButton,
              currentIndex === 0 && styles.navButtonDisabled,
            ]}
            disabled={currentIndex === 0}
            onPress={handlePreviousQuestion}
          >
            <Icon name="chevron-back" size={16} color="#fff" />
            <Text style={styles.navButtonText}>Previous</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.navButton,
              selectedAnswer === null && styles.navButtonDisabled,
            ]}
            disabled={selectedAnswer === null}
            onPress={handleCompletion}
          >
            <Text style={styles.navButtonText}>
              {currentIndex === quizData.length - 1 ? "Finish" : "Next"}
            </Text>
            <Icon name="chevron-forward" size={16} color="#fff" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: Platform.select({
    web: {
      flex: 1,
      backgroundColor: "#f9f9f9",
      padding: 16,
      alignItems: "center", // Center the app horizontally
      justifyContent: "center", // Center the app vertically
    },
    default: {
      flex: 1,
      backgroundColor: "#f9f9f9",
      padding: 16,
    },
  }),
  widthcontainer: Platform.select({
    web: {
      width: 375,
    },
    default: { width: "100%" },
  }),
  header: {
    marginBottom: 16,
    marginTop: 34,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 28,
  },
  backButtonText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
  },
  progressContainer: {
    marginBottom: 16,
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  levelText: {
    fontWeight: "bold",
    fontSize: 14,
  },
  progressText: {
    fontSize: 12,
    color: "#666",
  },
  progressBar: {
    height: 8,
    backgroundColor: "#e0e0e0",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressIndicator: {
    height: "100%",
    backgroundColor: "#3178C6",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  questionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  questionSubtitle: {
    fontSize: 14,
    color: "#666",
  },
  answers: {
    marginBottom: 48,
  },
  answerButton: {
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 8,
  },
  answerText: {
    fontSize: 14,
  },
  answerIndex: {
    fontWeight: "bold",
    marginRight: 8,
  },
  correctAnswer: {
    backgroundColor: "#d4edda",
    borderColor: "#c3e6cb",
  },
  incorrectAnswer: {
    backgroundColor: "#f8d7da",
    borderColor: "#f5c6cb",
  },
  resultCard: {
    position: "absolute",
    bottom: 80,
    padding: 16,
    borderRadius: 8,
    width: "100%",
  },
  resultCorrect: {
    backgroundColor: "#d4edda",
    borderColor: "#c3e6cb",
  },
  resultIncorrect: {
    backgroundColor: "#f8d7da",
    borderColor: "#f5c6cb",
  },
  resultTextCorrect: {
    color: "#155724",
  },
  resultTextIncorrect: {
    color: "#721c24",
  },
  navigation: {
    paddingTop: 120,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  navButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#3178C6",
  },
  navButtonText: {
    color: "#fff",
    fontSize: 14,
    marginHorizontal: 4,
  },
  navButtonDisabled: {
    backgroundColor: "#ccc",
  },
});
