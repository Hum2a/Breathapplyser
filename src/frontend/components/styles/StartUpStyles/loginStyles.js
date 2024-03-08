import { StyleSheet } from "react-native";

export const LoginStyles = StyleSheet.create({
  container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#BAEAFF',
    },
    input: {
      width: 300,
      height: 40,
      borderWidth: 1,
      borderColor: '#ccc',
      padding: 10,
      margin: 10,
      borderRadius: 5,
      fontSize: 16,
      color: '#333',
    },
    loginButton: {
      width: 200,
      height: 40,
      borderRadius: 20,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 20,
      overflow: 'hidden', // This ensures the gradient does not bleed outside the rounded borders
    },
    loginButtonGradient: {
      width: '100%',
      height: '100%',
      justifyContent: 'center',
      alignItems: 'center',
    },
    loginButtonText: {
      color: 'white',
      fontSize: 18,
      fontWeight: 'bold',
    },
});
