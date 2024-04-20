import React from "react";
import { TouchableOpacity, Image, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";

export const BackButton = () => {
    const navigation = useNavigation(); // Get navigation object

    const back = () => {
        navigation.pop(1); // Navigate back one screen
    };

    return (
        <TouchableOpacity style={styles.iconContainer} onPress={back}>
            <Image source={require('../../assets/images/back_arrow.png')} style={styles.icon} />
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    iconContainer: {
        position: 'absolute', // Position the button absolutely relative to its parent
        top: 0, // Distance from the top of the parent container
        left: 10, // Distance from the left of the parent container
        padding: 10, // Add padding for easier tapping
    },
    icon: {
        width: 70, // Set a fixed width for your icon
        height: 40, // Set a fixed height for your icon
        resizeMode: 'contain' // Ensure the icon scales properly
    }
});

