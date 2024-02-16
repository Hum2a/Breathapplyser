import { StyleSheet } from "react-native";

export const startDrinkingStyles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      padding: 16,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 16,
    },
    input: {
      width: '100%',
      height: 40,
      borderWidth: 1,
      borderColor: 'gray',
      borderRadius: 8,
      paddingHorizontal: 8,
      marginBottom: 16,
    },
    timeText: {
      fontSize: 16,
      marginBottom: 8,
    },
    button: {
      width: '100%',
      height: 40,
      backgroundColor: 'blue',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 8,
      marginBottom: 8,
    },
    buttonText: {
      color: 'white',
      fontWeight: 'bold',
    },
  });