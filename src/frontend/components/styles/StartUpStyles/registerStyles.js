import { StyleSheet } from "react-native";

export const RegisterStyles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center'
    },
    input: {
      width: 200,
      height: 40,
      borderWidth: 1,
      padding: 10,
      margin: 10
    },
    datePickerButton: {
      backgroundColor: '#4e9af1', // A pleasant blue color for the button
      padding: 15,
      borderRadius: 10,
      marginVertical: 10
    },
    datePickerButtonText: {
      color: 'white', // White text color for contrast
      fontWeight: 'bold', // Bold text
      fontSize: 16 // Slightly larger font
    }
});
