import { Dimensions, StyleSheet } from "react-native";

const screenWidth = Dimensions.get('window').width;

export const CommonStyles = StyleSheet.create({
    container: {
      padding: 10,
      borderRadius: 10,
      margin: 10,
      maxHeight: 300,
      maxWidth: screenWidth * 0.45,
      backgroundColor: 'transparent',
    },
    listItem: {
      backgroundColor: 'rgba(249, 249, 249, 0.5)',
      marginVertical: 6,
      borderRadius: 5,
      padding: 8,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.20,
      shadowRadius: 1.41,
      elevation: 2,
    },
    text: {
      fontSize: 14,
      color: '#333',
    },
    title: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 10,
      color: '#333',
      textAlign: 'center',
    },
    refreshButton: {
        position: 'absolute', // Position it over your component or at a fixed position
        right: 10,  // Right margin from the container
        top: 25,   // Top margin from the container
        padding: 10,
        zIndex: 1000,  // Make sure it floats above other components
    },
    refreshIcon: {
        width: 24,   // Suitable size for an icon
        height: 24,  // Matching height for the icon
    },
    buttonText: {
        fontSize: 14,
        color: 'white',
        textAlign: 'center',
    },
    button: {
        backgroundColor: '#007bff',
        padding: 8,
        borderRadius: 5,
        marginVertical: 8,
    },
    dialogContainer: {
      padding: 20,
      borderRadius: 8,
      backgroundColor: '#ffffff', // clean white background
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 3,
      elevation: 5,
    },
    dialogTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333', // dark grey for strong visibility
        marginBottom: 10,
    },
    dialogDescription: {
        fontSize: 16,
        color: '#666', // slightly lighter grey for the description
        marginBottom: 20,
    },
    dialogButton: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        backgroundColor: '#007bff', // consistent blue with other buttons
        borderRadius: 5,
        elevation: 2,
    },
    dialogButtonText: {
        color: 'white', // white text for clarity and contrast
        fontSize: 16,
        textAlign: 'center',
    },
    dialogButtonCancel: {
        backgroundColor: '#6c757d', // a muted grey for the cancel button
    },
});
