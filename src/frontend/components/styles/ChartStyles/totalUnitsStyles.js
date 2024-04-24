import { StyleSheet } from "react-native";

export const totalUnitsStyles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      padding: 20,
      backgroundColor: '#F0F8FF', // Light blue background
    },
    graphTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#003366', // Dark blue for contrast and readability
      marginBottom: 20,
    },
    toggleLabel: {
      fontSize: 18,
      marginBottom: 10,
    },
    pickersContainer: {
      flexDirection: 'row',
      marginTop: 5, // Add margin top for spacing
      backgroundColor: 'transparent',
      borderRadius: 5,
      padding: 5,
    },
    pickerStyle: {
      width: '80%',
      height: 40,
      marginBottom: 20,
      backgroundColor: 'rgba(242,66,66,0.4)',
      borderRadius: 20, // Rounded border
      borderWidth: 1,
      borderColor: '#007AFF', // Theme consistent blue for the border
      paddingHorizontal: 10, // Add padding for a softer look
  },
    legendContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 10,
    },
    legendItem: {
      width: 10,
      height: 10,
      borderRadius: 5,
      marginRight: 5,
    },
    legendLabel: {
      fontSize: 14,
    },
    noDataText: {
      fontSize: 16,
      marginTop: 20,
      textAlign: 'center', // Ensure text is centered
    },
    refreshButton: {
      padding: 10,
      margin: 10,
      backgroundColor: 'transparent',
      alignItems: 'center',
    },
    updateButtonImage: {
      width: 30,
      height: 30,
    },
  });