import { StyleSheet } from "react-native";

export const LoginStyles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#fff', // Background color
    },
    input: {
      width: 300,
      height: 40,
      borderWidth: 1,
      borderColor: '#ccc', // Border color
      padding: 10,
      margin: 10,
      borderRadius: 5, // Rounded corners
      fontSize: 16,
      color: '#333', // Text color
    },
    loginButton: {
      backgroundColor: '#4CAF50', // Button background color
      width: 200,
      height: 40,
      borderRadius: 20, // Rounded button
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 20,
    },
    loginButtonText: {
      color: 'white',
      fontSize: 18,
      fontWeight: 'bold',
    },
  });