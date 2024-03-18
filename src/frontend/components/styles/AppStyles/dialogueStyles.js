import { StyleSheet } from "react-native";

export const dialogStyles = StyleSheet.create({
    title: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#0277BD', // Light blue
      marginBottom: 15,
    },
    description: {
      fontSize: 16,
      color: '#004C8C', // Slightly darker blue for contrast
      marginBottom: 20,
    },
    buttonLabel: {
      fontSize: 18,
      fontWeight: '500',
    },
    cancelButton: {
      color: '#CDDC39', // Yellowish-green for the cancel button
    },
    deleteButton: {
      color: '#F44336', // Red for the delete button
    },
  });