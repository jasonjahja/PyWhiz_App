import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import Quiz from './quiz';

const Module5: React.FC = () => {
    const [quizComplete, setQuizComplete] = useState(false);

    return (
        <ScrollView style={styles.container}>
            <View style={styles.moduleContainer}>
                <Text style={styles.title}>Advanced Loops</Text>
                <Text style={styles.content}>
                    Advanced loops in Python allow you to iterate through complex data structures,
                    such as dictionaries or nested loops.
                </Text>
                <Text style={styles.subtitle}>Example:</Text>
                <Text style={styles.code}>
                    {'my_dict = {"a": 1, "b": 2}\nfor key, value in my_dict.items():\n  print(key, value)'}
                </Text>
            </View>

            <Quiz
                question="What does this code output?\nfor i in range(2):\n  for j in range(2):\n    print(i, j)"
                options={['0 0\n0 1\n1 0\n1 1', '0 0\n1 1\n2 2', 'Error']}
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

export default Module5;
