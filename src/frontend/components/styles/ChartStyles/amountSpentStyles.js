import { StyleSheet } from "react-native";

export const amountSpentStyles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      padding: 20,
    },
    graphTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#003366', // Dark blue for contrast and readability
      marginBottom: 20,
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