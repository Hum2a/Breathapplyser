import { StyleSheet } from "react-native";

export const bacComparisonStyles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 20, // Adjust the horizontal padding
      paddingTop: 40, // Add padding top for spacing
    },
    pickersContainer: {
      flexDirection: 'row',
      marginTop: 20, // Add margin top for spacing
    },
    pickerStyle: {
      flex: 1,
      height: 40,
      marginHorizontal: 5, // Adjust horizontal margin for spacing
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 5,
    },
    legendContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 20, // Add margin top for spacing
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
    graphTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      textAlign: 'center',
      marginBottom: 20, // Increase margin bottom for spacing
    },
  });