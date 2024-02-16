import { Dimensions, StyleSheet } from "react-native";

const screenWidth = Dimensions.get('window').width;

export const CommonStyles = StyleSheet.create({
    container: {
      padding: 10,
      backgroundColor: '#F0F0F0',
      borderRadius: 10,
      margin: 10,
      maxHeight: 200,
      maxWidth: screenWidth * 0.4,
    },
    listItem: {
      backgroundColor: '#FFFFFF',
      padding: 10,
      marginVertical: 5,
      borderRadius: 5,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.22,
      shadowRadius: 2.22,
      elevation: 3,
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
    buttonText: {
        fontSize: 14, // Reduced font size for button text
        color: 'white',
        textAlign: 'center',
      },
    button: {
        backgroundColor: '#007bff', // A nice shade of blue for buttons
        padding: 8, // Reduced padding for buttons
        borderRadius: 5,
        marginVertical: 8, // Reduced margin at the top and bottom for buttons
      }
  });