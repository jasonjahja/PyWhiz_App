import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import Quiz from './quiz';

const Module7: React.FC = () => {
    const [quizComplete, setQuizComplete] = useState(false);

    return (
        <ScrollView style={styles.container}>
            <View style={styles.moduleContainer}>
                <Text style={styles.title}>Algorithms</Text>
                <Text style={styles.content}>
                    Algorithms are step-by-step instructions for solving a problem. Common algorithms
                    include searching, sorting, and pathfinding.
                </Text>
                <Text style={styles.subtitle}>Example:</Text>
                <Text style={styles.code}>
                    {'def linear_search(arr, target):\n  for i in range(len(arr)):\n    if arr[i] == target:\n      return i\n  return -1'}
                </Text>
            </View>

            <Quiz
                question="What is the purpose of the bubble sort algorithm?"
                options={['To sort a list', 'To search for an element', 'To merge two lists']}
                correctAnswerIndex={0}
                onQuizComplete={() => setQuizComplete(true)}
            />

            {quizComplete && (
                <TouchableOpacity style={styles.nextButton} onPress={() => console.log('Finish Modules')}>
                    <Text style={styles.buttonText}>Finish</Text>
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

export default Module7;
