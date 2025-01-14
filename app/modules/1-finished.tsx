import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const Module1Finished: React.FC<{ navigation: any }> = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Congratulations!</Text>
            <Text style={styles.content}>You have completed Module 1.</Text>
            <TouchableOpacity
                style={styles.nextButton}
                onPress={() => window.location.href="2"}
            >
                <Text style={styles.buttonText}>Go to Next Module</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    content: {
        fontSize: 18,
        marginBottom: 32,
        textAlign: 'center',
    },
    nextButton: {
        backgroundColor: '#4caf50',
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default Module1Finished;
