import { StyleSheet } from "react-native";

export const dialogStyles = StyleSheet.create({
    title: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#0277BD', // Light blue
      alignSelf: 'center'
    },
    description: {
      fontSize: 16,
      color: '#004C8C', // Slightly darker blue for contrast
      alignSelf: 'center'
    },
    buttonLabel: {
      fontSize: 18,
      fontWeight: '500',
    },
    cancelButton: {
      color: '#CDDC39', // Yellowish-green for the cancel button
      fontSize: 14,
      fontWeight: '500',
      marginLeft: 10,
    },
    deleteButton: {
      color: '#F44336', // Red for the delete button
      fontSize: 14,
      fontWeight: '500',
      textAlign: 'center',
      marginRight: 20,
      marginLeft: 25,
    },
    editButton: {
      color: '#1FCDA0',
      fontSize: 14,
      fontWeight: '500',
      textAlign: 'left',
      marginRight: 10
    }
  });