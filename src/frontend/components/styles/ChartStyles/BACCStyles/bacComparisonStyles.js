import { StyleSheet } from "react-native";

export const bacComparisonStyles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 20, // Adjust the horizontal padding
      paddingTop: 40, // Add padding top for spacing
      backgroundColor: '#E1F5FE', // Light blue background for the container
    },
    pickersContainer: {
      flexDirection: 'row',
      marginTop: 20, // Add margin top for spacing
      backgroundColor: '#B3E5FC', // Slightly darker shade for the picker container
      borderRadius: 5,
      padding: 5,
    },
    pickerStyle: {
      flex: 1,
      height: 40,
      marginHorizontal: 5, // Adjust horizontal margin for spacing
      borderWidth: 1,
      borderColor: '#29B6F6', // Light blue border color
      borderRadius: 5,
      backgroundColor: '#E1F5FE', // Lighter blue background for the picker
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
      color: '#01579b', // Using the darker blue for better readability
    },
    graphTitle: {
      color: '#01579b', // Darker blue for the title text for contrast
      fontSize: 18, // Slightly larger font size for better visibility
      fontWeight: 'bold',
      textAlign: 'center',
      marginBottom: 10,
    },
});
