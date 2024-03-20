import { StyleSheet } from "react-native";

export const drunkStyles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 20, // Adjust the horizontal padding
      paddingTop: 40, // Add padding top for spacing
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
    toggleButton: {
      backgroundColor: '#29b6f6', // A light blue color for the button
      padding: 10,
      borderRadius: 5,
      alignItems: 'center',
      marginVertical: 10,
      shadowColor: "#000", // Optional: adding shadow for better depth
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    toggleButtonText: {
      color: '#ffffff', // Keeping the text color white for contrast
      fontSize: 16,
      fontWeight: 'bold',
    },
    marker: {
        position: 'absolute',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        left: 0,
        right: 0,
        zIndex: 100,
      },
      markerLabel: {
        fontSize: 12,
        fontWeight: 'bold',
        marginRight: 5,
      },
      circle: {
        position: 'absolute',
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: 'red', // Adjust circle color as needed
      },
      noDataText: {
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 20,
      },
});
