import { StyleSheet } from "react-native";

export const RankingStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#ADD8E6', // Light blue background
      paddingHorizontal: 10,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 20,
      color: '#005f73', // Darker blue for text contrast
      textAlign: 'center',
    },
    listItem: {
      backgroundColor: '#fff',
      borderRadius: 5,
      padding: 10,
      marginBottom: 10,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.23,
      shadowRadius: 2.62,
      elevation: 4,
    },
    listItemText: {
      color: '#003049', // Dark blue color for the list item text
      fontSize: 16,
    }
  });