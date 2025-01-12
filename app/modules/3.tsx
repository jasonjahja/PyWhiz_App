import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import Quiz from './quiz';

const Module3: React.FC = () => {
    const [quizComplete, setQuizComplete] = useState(false);

    return (
        <ScrollView style={styles.container}>
            <View style={styles.moduleContainer}>
                <Text style={styles.title}>Loops</Text>
                <Text style={styles.content}>
                    Loops in Python are used to execute a block of code repeatedly. Python has two primary
                    loops: `for` loops and `while` loops.
                </Text>
                <Text style={styles.subtitle}>Example:</Text>
                <Text style={styles.code}>
                    {'for i in range(3):\n  print(i)'}
                </Text>
            </View>

            <Quiz
                question="What does this code output?\nfor i in range(2):\n  print(i)"
                options={['0\n1', '1\n2', '0\n1\n2', 'Error']}
                correctAnswerIndex={0}
                onQuizComplete={() => setQuizComplete(true)}
            />

            {quizComplete && (
                <TouchableOpacity style={styles.nextButton} onPress={() => console.log('Go to Module 4')}>
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

export default Module3;
