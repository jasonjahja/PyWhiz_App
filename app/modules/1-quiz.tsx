import React from 'react';
import { View, StyleSheet } from 'react-native';
import Quiz from './quiz';

const Module1Quiz: React.FC<{ navigation: any }> = ({ navigation }) => {
    const handleQuizComplete = () => {
        window.location.href="1-finished";
    };

    return (
        <View style={styles.container}>
            <Quiz
                question="What is the output of the following code? print('Hello, World!')"
            options={['Hello, World!', 'Error', 'Nothing', 'Syntax Error']} // Opsi jawaban
            correctAnswerIndex={0} // Jawaban yang benar adalah 'Hello, World!'
            onQuizComplete={handleQuizComplete} // Navigasi setelah kuis selesai
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
