import React from 'react';
import { View, StyleSheet } from 'react-native';
import Quiz from './quiz';
import { useRouter } from 'expo-router';

const Module1Quiz: React.FC = () => {
    const router = useRouter(); // Initialize the router

    const handleQuizComplete = () => {
        router.push('/modules/1-finished'); // Navigate to the "finished" page
    };

    return (
        <View style={styles.container}>
            <Quiz
                question="What is the output of the following code? print('Hello, World!')"
                options={['Hello, World!', 'Error', 'Nothing', 'Syntax Error']} // Answer options
                correctAnswerIndex={0} // Correct answer is 'Hello, World!'
                onQuizComplete={handleQuizComplete} // Navigate after quiz completion
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#fff',
        justifyContent: 'center',
    },
});

export default Module1Quiz;
