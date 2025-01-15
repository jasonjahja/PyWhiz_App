import { useRouter } from 'expo-router';
import { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

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
          <Icon name="chevron-back" size={20} color="#000" />
        </TouchableOpacity>

        {/* Progress Section */}
        <View style={styles.progressContainer}>
          <View style={styles.progressHeader}>
            <Text style={styles.levelText}>Level 1</Text>
            <Text style={styles.progressText}>Question 3 of 5</Text>
          </View>
          <View style={styles.progressBar}>
            <View style={[styles.progressIndicator, { width: `${currentProgress}%` }]} />
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
              <Text style={styles.answerIndex}>{String.fromCharCode(65 + index)}.</Text> {answer}
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
          <Text style={isCorrect ? styles.resultTextCorrect : styles.resultTextIncorrect}>
            {isCorrect
              ? 'Correct! Well done!'
              : 'Incorrect. The correct answer is: A program that executes Python code'}
          </Text>
        </View>
      )}

      {/* Navigation Buttons */}
      <View style={styles.navigation}>
        <TouchableOpacity
          style={[styles.navButton, currentProgress <= 20 && styles.navButtonDisabled]}
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
    backgroundColor: '#f4f4f9', // Softer background color for better contrast
    padding: 16,
    paddingHorizontal: 18,
  },
  header: {
    marginBottom: 16,
    marginTop: 34,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 28,
  },
  backButtonText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#444', // Subtle text color
  },
  progressContainer: {
    marginBottom: 16,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  levelText: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#333',
  },
  progressText: {
    fontSize: 12,
    color: '#666',
  },
  progressBar: {
    height: 10, // Slightly taller progress bar
    backgroundColor: '#e0e0e0',
    borderRadius: 10,
    overflow: 'hidden',
  },
  progressIndicator: {
    height: '100%',
    backgroundColor: '#3178C6', // Vibrant progress bar color
    borderRadius: 10,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 192,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 2, // Android shadow
  },
  questionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  questionSubtitle: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  answers: {
    marginBottom: 48,
  },
  answerButton: {
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  answerText: {
    fontSize: 14,
    color: '#333',
  },
  answerIndex: {
    fontWeight: 'bold',
    marginRight: 8,
    color: '#3178C6', // Add some accent color
  },
  correctAnswer: {
    backgroundColor: '#e8f5e9',
    borderColor: '#66bb6a',
  },
  incorrectAnswer: {
    backgroundColor: '#ffebee',
    borderColor: '#ef5350',
  },
  resultCard: {
    position: 'absolute',
    top: 360,
    left: 16,
    padding: 16,
    borderRadius: 12,
    width: '92%',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 3, // Add shadow for Android
  },
  resultCorrect: {
    backgroundColor: '#e8f5e9',
    borderColor: '#66bb6a',
  },
  resultIncorrect: {
    backgroundColor: '#ffebee',
    borderColor: '#ef5350',
  },
  resultTextCorrect: {
    color: '#2e7d32',
    fontWeight: '600',
    fontSize: 16,
    textAlign: 'center',
  },
  resultTextIncorrect: {
    color: '#c62828',
    fontWeight: '600',
    fontSize: 16,
    textAlign: 'center',
  },
  navigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 12,
    backgroundColor: '#3178C6',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  navButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    marginHorizontal: 4,
  },
  navButtonDisabled: {
    backgroundColor: '#ddd',
  },
});
