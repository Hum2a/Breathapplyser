import { Dimensions, StyleSheet } from "react-native";

const screenWidth = Dimensions.get('window').width;

export const CommonStyles = StyleSheet.create({
    container: {
      padding: 10,
      borderRadius: 10,
      margin: 10,
      maxHeight: 200,
      maxWidth: screenWidth * 0.5,
      backgroundColor: '#92DDFE',
      borderColor: 'gold',
      borderWidth: 0.5,
    },
    listItem: {
      backgroundColor: 'rgba(249, 249, 249, 0.5)', // Making background slightly transparent
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