import { StyleSheet } from "react-native";

export const bacPredictionStyles = StyleSheet.create({
    toggleButton: {
      backgroundColor: '#29b6f6', // A light blue color for the button
      padding: 10,
      borderRadius: 5,
      alignItems: 'center',
      marginVertical: 10,
      shadowColor: "#000", // Optional: adding shadow for better depth
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    toggleButtonText: {
      color: '#ffffff', // Keeping the text color white for contrast
      fontSize: 16,
      fontFamily: 'my_coffee_break',
    },
    graphTitle: {
      color: '#01579b', // Darker blue for the title text for contrast
      fontSize: 18, // Slightly larger font size for better visibility
      fontWeight: 'bold',
      textAlign: 'center',
      marginBottom: 10,
    },
});
