import { StyleSheet } from 'react-native';

export const feedbackStyles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 20,
        backgroundColor: '#f0faff', // Very light blue background
    },
    itemContainer: {
        padding: 20,
        marginHorizontal: 10,
        marginVertical: 5,
        backgroundColor: '#e6f7ff', // Light blue for item containers
        borderRadius: 10,
        alignItems: 'flex-start',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    text: {
        fontSize: 16,
        color: '#003366', // Dark blue for better contrast and readability
        marginBottom: 5,
        lineHeight: 24, // Increased line height for better readability
    },
    bacText: {
        fontSize: 18,
        fontWeight: '500', // Medium font weight for slight emphasis
        color: '#0055b3', // Slightly brighter blue for key info
        marginBottom: 2,
        textShadowColor: 'rgba(0, 0, 0, 0.1)', // Subtle text shadow for depth
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
    },
    feedbackText: {
        fontSize: 16,
        color: '#003366', // Consistent dark blue for text
        fontStyle: 'italic', // Italicized to differentiate feedback text
        marginBottom: 10,
    },
    timestampText: {
        fontSize: 14,
        color: '#666', // Grey for less emphasis on auxiliary info
        marginBottom: 0,
        textTransform: 'uppercase', // Uppercase for timestamp labels
        letterSpacing: 1, // Increased letter spacing for a modern look
    },
    title: {
        fontSize: 20,
        color: '#0077B6', // A richer shade of blue for titles
        marginBottom: 10,
        textAlign: 'center',
        fontFamily: 'my_coffee_break',
    }
});