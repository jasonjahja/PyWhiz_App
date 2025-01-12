import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import Quiz from './quiz';

const Module2: React.FC = () => {
    const [quizComplete, setQuizComplete] = useState(false);

    return (
        <ScrollView style={styles.container}>
            <View style={styles.moduleContainer}>
                <Text style={styles.title}>Conditional Statements</Text>
                <Text style={styles.content}>
                    Conditional statements in Python allow you to execute code based on specific conditions.
                    The most common conditional statement is the `if` statement.
                </Text>
                <Text style={styles.subtitle}>Example:</Text>
                <Text style={styles.code}>
                    {'if 5 > 2:\n  print("5 is greater than 2")'}
                </Text>
            </View>

            <Quiz
                question="What does this code output?\nif 3 < 5:\n  print('Yes')"
                options={['Yes', 'No', 'Error', 'Nothing']}
                correctAnswerIndex={0}
                onQuizComplete={() => setQuizComplete(true)}
            />

            {quizComplete && (
                <TouchableOpacity style={styles.nextButton} onPress={() => console.log('Go to Module 3')}>
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

export default Module2;
