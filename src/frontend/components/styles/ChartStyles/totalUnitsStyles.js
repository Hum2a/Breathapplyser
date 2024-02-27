import { StyleSheet } from "react-native";

export const totalUnitsStyles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 20, // Adjust the horizontal padding
      paddingTop: 40, // Add padding top for spacing
    },
    toggleLabel: {
      fontSize: 18,
      marginBottom: 10,
    },
    pickerStyle: {
      width: '80%',
      height: 40,
      marginBottom: 10,
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 5,
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
    graphTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      textAlign: 'center',
      marginBottom: 10,
    },
  });