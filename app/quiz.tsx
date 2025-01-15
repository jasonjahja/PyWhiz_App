import { useRouter } from "expo-router";
import { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

export default function QuizPage() {
  const router = useRouter();
  const [currentProgress, setCurrentProgress] = useState(60);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const handleAnswerSelect = (index: number) => {
    setSelectedAnswer(index);
    // Demo: setting 2nd answer as correct
    setIsCorrect(index === 1);
  };

  const answers = [
    "The process of converting high-level language to machine code",
    "A program that executes Python code",
    "A text editor for writing code",
    "A debugging tool",
  ];

  return (
    <View style={styles.container}>
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
            <Text style={styles.progressText}>Question 3 of 5</Text>
          </View>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressIndicator,
                { width: `${currentProgress}%` },
              ]}
            />
          </View>
        </View>
      </View>

      {/* Question Section */}
      <View style={styles.card}>
        <Text style={styles.questionTitle}>What is a Python interpreter?</Text>
        <Text style={styles.questionSubtitle}>
          Choose the most accurate definition from the options below.
        </Text>
      </View>

      {/* Answer Section */}
      <View style={styles.answers}>
        {answers.map((answer, index) => (
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
              isCorrect ? styles.resultTextCorrect : styles.resultTextIncorrect
            }
          >
            {isCorrect
              ? "Correct! Well done!"
              : "Incorrect. The correct answer is: A program that executes Python code"}
          </Text>
        </View>
      )}

      {/* Navigation Buttons */}
      <View style={styles.navigation}>
        <TouchableOpacity
          style={[
            styles.navButton,
            currentProgress <= 20 && styles.navButtonDisabled,
          ]}
          disabled={currentProgress <= 20}
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
        >
          <Text style={styles.navButtonText}>Next</Text>
          <Icon name="chevron-forward" size={16} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    padding: 16,
  },
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
    marginBottom: 192,
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
    top: 380,
    left: 16,
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
