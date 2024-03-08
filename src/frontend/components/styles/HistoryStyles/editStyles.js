import { StyleSheet } from "react-native";

export const editStyles = StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: 20,
      paddingTop: 20,
      backgroundColor: '#BAEAFF', // Light blue background for consistency
    },
    input: {
      height: 40,
      borderColor: '#0077B6', // Brighter blue for border, providing good contrast
      borderWidth: 1,
      borderRadius: 8,
      padding: 10,
      marginBottom: 16,
      backgroundColor: '#E7F2F8', // Very light blue for input background, enhancing readability
      color: '#003366', // Dark blue for input text for better visibility
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 16,
      color: '#005f73', // Darker blue for titles, ensuring readability
      textAlign: 'center',
    },
    button: {
      backgroundColor: '#007AFF', // Use a consistent theme blue for buttons
      borderRadius: 8,
      paddingVertical: 12,
      paddingHorizontal: 16,
      marginTop: 16,
      alignItems: 'center',
    },
    buttonText: {
      color: '#ffffff', // White text for button for clarity
      fontSize: 16,
      fontWeight: 'bold',
    },  
    entry: {
      backgroundColor: '#f0f0f0',
      borderRadius: 8,
      padding: 16,
      marginBottom: 8,
    },
    selectedEntry: {
      backgroundColor: '#e0e0e0',
    },
    entryText: {
      fontSize: 16,
      marginBottom: 8,
    },
    editEntryContainer: {
      marginTop: 16,
    },
    editEntryTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 8,
    },
  });


export const editEntryStyles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: '#F0F0F0',
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 20,
      color: '#333',
      textAlign: 'center',
    },
    inputContainer: {
      marginBottom: 20,
      backgroundColor: '#FFFFFF', // Light background for the input container
      padding: 10,
      borderRadius: 5, // Slight roundness
      shadowColor: '#000', // Shadow for depth
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    inputLabel: {
      fontSize: 16,
      marginBottom: 5,
      color: '#666',
      fontWeight: 'bold', // Make the label bold
    },
    input: {
      height: 40,
      borderColor: '#ccc',
      borderWidth: 1,
      borderRadius: 5,
      paddingHorizontal: 10,
      backgroundColor: '#fff',
      marginBottom: 10,
    },
    button: {
      backgroundColor: '#007AFF',
      paddingVertical: 12,
      paddingHorizontal: 20,
      borderRadius: 5,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 20,
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.2,
      shadowRadius: 1.41,
      marginBottom: 100,
    },
    buttonText: {
      color: '#FFFFFF',
      fontSize: 18,
      textAlign: 'center',
    },
  });
  
