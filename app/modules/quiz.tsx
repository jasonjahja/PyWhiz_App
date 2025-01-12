import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

type QuizProps = {
    question: string;
    options: string[];
    correctAnswerIndex: number;
    onQuizComplete: () => void;
};

const Quiz: React.FC<QuizProps> = ({ question, options, correctAnswerIndex, onQuizComplete }) => {
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [result, setResult] = useState<string | null>(null);

    const handleSubmit = () => {
        if (selectedOption === correctAnswerIndex) {
            setResult('Correct!');
            onQuizComplete();
        } else {
            setResult('Incorrect, try again!');
        }
    };

    return (
        <View style={styles.quizContainer}>
            <Text style={styles.question}>{question}</Text>
            {options.map((option, index) => (
                <TouchableOpacity
                    key={index}
                    style={[
                        styles.option,
                        selectedOption === index && { backgroundColor: '#ccc' },
                    ]}
                    onPress={() => setSelectedOption(index)}
                >
                    <Text style={styles.optionText}>{option}</Text>
                </TouchableOpacity>
            ))}
            {result && <Text style={styles.result}>{result}</Text>}
            <TouchableOpacity
                style={styles.submitButton}
                onPress={handleSubmit}
                disabled={selectedOption === null}
            >
                <Text style={styles.buttonText}>Submit</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    quizContainer: { padding: 16 },
    question: { fontSize: 18, fontWeight: 'bold', marginBottom: 12 },
    option: {
        padding: 12,
        marginVertical: 6,
        backgroundColor: '#f0f0f0',
        borderRadius: 8,
    },
    optionText: { fontSize: 16 },
    submitButton: {
        backgroundColor: '#3178C6',
        padding: 12,
        borderRadius: 8,
        marginTop: 12,
    },
    buttonText: { color: '#fff', textAlign: 'center', fontSize: 16 },
    result: { marginTop: 12, fontSize: 18, fontWeight: 'bold', textAlign: 'center' },
});

export default Quiz;
