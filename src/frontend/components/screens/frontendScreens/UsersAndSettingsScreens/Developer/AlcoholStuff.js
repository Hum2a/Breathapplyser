import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const AlcoholStuff = ({ navigation }) => {
    // Function to navigate based on button press
    const navigateToDetail = (detailScreen) => {
        navigation.navigate(detailScreen);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Alcohol Stuff</Text>
            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => navigateToDetail('Developer Entries')}
                    activeOpacity={0.7}>
                    <Text style={styles.buttonText}>Entries</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => navigateToDetail('Developer BAC Level')}
                    activeOpacity={0.7}>
                    <Text style={styles.buttonText}>BAC Level</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => navigateToDetail('Developer Venues')}
                    activeOpacity={0.7}>
                    <Text style={styles.buttonText}>Venues</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#FFFFFF'
    },
    header: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#333333',
        marginBottom: 30,
        textAlign: 'center'
    },
    buttonContainer: {
        marginHorizontal: 20,
    },
    button: {
        backgroundColor: '#007AFF',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 25,
        marginBottom: 15,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        textAlign: 'center'
    }
});

export default AlcoholStuff;
