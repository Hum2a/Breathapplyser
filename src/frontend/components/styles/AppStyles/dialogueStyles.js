import { StyleSheet } from "react-native";

export const dialogStyles = StyleSheet.create({
    container: {
      backgroundColor: '#000', // Set the dialog background to black
      padding: 20, // Add some padding for spacing
      borderRadius: 10, // Rounded corners for a modern look
      borderWidth: 1, // Optional border
      borderColor: '#0277BD' // A light blue border for contrast
  },
    title: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#0277BD', // Light blue
      alignSelf: 'center',
      marginBottom: 10, // Spacing between title and description
    },
    description: {
      fontSize: 16,
      color: '#DDDDDD', // Light gray for readability on black
      alignSelf: 'center',
      marginBottom: 20, // Spacing before buttons
    },
    buttonLabel: {
      fontSize: 18,
      fontWeight: '500',
      color: '#FFFFFF', // White buttons for clarity and style
    },
    cancelButton: {
      color: '#FF6347', // Tomato red for the cancel button, provides good contrast on black
      fontSize: 18,
      fontWeight: '500',
      marginRight: 10, // Right margin for spacing between buttons
    },
    deleteButton: {
      color: '#32CD32', // Lime green for the delete button, vibrant against black
      fontSize: 18,
      fontWeight: '500',
      marginLeft: 10, // Left margin for spacing between buttons
    },
    editButton: {
      color: '#1E90FF', // Dodger blue for the edit button, easy visibility
      fontSize: 18,
      fontWeight: '500',
      textAlign: 'left',
      marginRight: 10, // Right margin for aesthetic spacing
    },
    logoutButton: {
      backgroundColor: '#D32F2F', // A deep red for a distinctive logout button
      color: '#fff',
      paddingVertical: 12,
      paddingHorizontal: 20,
      borderRadius: 30, // Fully rounded ends for a pill shape
      elevation: 4, // Shadow for Android
      shadowColor: '#000', // Shadow color
      shadowOffset: { width: 0, height: 2 }, // Shadow offset
      shadowOpacity: 0.25, // Shadow opacity
      shadowRadius: 3.84, // Shadow blur
      marginVertical: 10, // Vertical margin
      alignSelf: 'center', // Center align in its container
      width: 200, // Fixed width
    }
  });