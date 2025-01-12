import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import Quiz from './quiz';

const Module4: React.FC = () => {
    const [quizComplete, setQuizComplete] = useState(false);

    return (
        <ScrollView style={styles.container}>
            <View style={styles.moduleContainer}>
                <Text style={styles.title}>Functions</Text>
                <Text style={styles.content}>
                    Functions in Python are used to encapsulate code that you want to reuse. Functions are
                    defined using the `def` keyword.
                </Text>
                <Text style={styles.subtitle}>Example:</Text>
                <Text style={styles.code}>
                    {'def greet():\n  print("Hello")\n\ngreet()'}
                </Text>
            </View>

            <Quiz
                question="What does this code output?\ndef greet():\n  print('Hello')\ngreet()"
                options={['Hello', 'Error', 'Nothing', 'Hello World']}
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

export default Module4;
