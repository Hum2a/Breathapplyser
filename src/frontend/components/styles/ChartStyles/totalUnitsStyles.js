import { StyleSheet } from "react-native";

export const totalUnitsStyles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      padding: 20,
    },
    graphTitle: {
      fontSize: 24,
      color: '#003366', // Dark blue for contrast and readability
      marginBottom: 20,
      fontFamily: 'my_coffee_break',
    },
    toggleLabel: {
      fontSize: 18,
      marginBottom: 10,
      color: 'crimson',
      fontFamily: 'my_coffee_break',
    },
    pickersContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginVertical: 10,
      backgroundColor: 'red',
    },
    pickerStyle: {
      flex: 1,
      height: 50,
      backgroundColor: '#ffffff',
      borderRadius: 10,
      marginRight: 10,
      alignSelf: 'center',
      color: 'black',
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
      fontFamily: 'my_coffee_break',
    },
    noDataText: {
      fontSize: 16,
      marginTop: 20,
      textAlign: 'center', // Ensure text is centered
      fontFamily: 'my_coffee_break',

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