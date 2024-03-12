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
    pickersContainer: {
      flexDirection: 'row',
      marginTop: 5, // Add margin top for spacing
      backgroundColor: 'transparent',
      borderRadius: 5,
      padding: 5,
    },
    pickerStyle: {
      flex: 1,
      height: 40,
      marginHorizontal: 5, // Adjust horizontal margin for spacing
      borderWidth: 10,
      borderColor: '#29B6F6', // Light blue border color
      borderRadius: 50,
      backgroundColor: '#E1F5FE', // Lighter blue background for the picker
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