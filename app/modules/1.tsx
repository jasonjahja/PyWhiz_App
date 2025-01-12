import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import Quiz from './quiz';

const Module1: React.FC = () => {
    const [quizComplete, setQuizComplete] = useState(false);

    return (
        <ScrollView style={styles.container}>
            <View style={styles.moduleContainer}>
                <Text style={styles.title}>What is Python?</Text>
                <Text style={styles.content}>
                    Python is a widely-used programming language known for its simplicity and readability,
                    making it an excellent choice for beginners and experts alike.
                </Text>
                <Text style={styles.subtitle}>First Python Program: Hello World!</Text>
                <Text style={styles.code}>print("Hello, World!")</Text>
            </View>

            <Quiz
                question="What will this code output?\nprint('Hello, World!')"
                options={['Hello World', 'Hello, World!', 'Error', 'Nothing']}
                correctAnswerIndex={1}
                onQuizComplete={() => setQuizComplete(true)}
            />

            {quizComplete && (
                <TouchableOpacity style={styles.nextButton} onPress={() => console.log('Go to Module 2')}>
                    <Text style={styles.buttonText}>Next Module</Text>
                </TouchableOpacity>
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16, backgroundColor: '#fff' },
    moduleContainer: { marginBottom: 16 },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 8 },
    content: { fontSize: 16, marginBottom: 16 },
    subtitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 8 },
    code: {
        fontFamily: 'monospace',
        backgroundColor: '#f5f5f5',
        padding: 8,
        borderRadius: 8,
        fontSize: 16,
        marginBottom: 16,
    },
    nextButton: {
        backgroundColor: '#28a745',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 16,
    },
    buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});

export default Module1;
