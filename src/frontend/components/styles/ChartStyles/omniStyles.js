import { StyleSheet } from "react-native";

export const omniStyles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#BAEAFF', // Light blue background consistent with the app theme
    },
    button: {
      backgroundColor: '#007AFF', // Use a consistent blue shade for buttons
      padding: 20,
      borderRadius: 10,
      marginVertical: 10,
      width: '80%',
      flexDirection: 'row', // Align text and icon horizontally
      justifyContent: 'space-between', // Distribute space evenly between text and icon
      alignItems: 'center', // Center items vertically
      shadowColor: '#000',
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
      fontSize: 20,
      fontWeight: 'bold',
      flex: 1, // Allow text to take up available space, pushing the icon to the edge
      textAlign: 'left', // Align text to the left
    },
    graphTitle: {
      fontSize: 32,
      fontWeight: 'bold',
      color: '#003366', // Dark blue for better contrast and readability
      textAlign: 'center',
      marginBottom: 20,
      paddingVertical: 10,
    },
    smallIcon: {
      width: 60, // Specify icon size
      height: 60, // Specify icon size
      resizeMode: 'contain', // Ensure the entire icon is visible and proportionate
    },
});
