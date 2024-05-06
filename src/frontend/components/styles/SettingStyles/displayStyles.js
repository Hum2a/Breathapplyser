import { StyleSheet } from "react-native";

export const DisplayStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#b6e6fd',
      paddingTop: 20,
      paddingHorizontal: 20,
    },
    header: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 20,
      color: '#333',
      textAlign: 'center',
      color: '#062376',
    },
    option: {
      marginBottom: 20,
      alignItems: 'center',
    },
    title: {
      fontSize: 24,
      color: '#010100',
      padding: 10,
      marginBottom: 20,
      alignSelf: 'center',
      alignItems: 'center',
      justifyContent: 'center',
      borderBottomWidth: 1,
      borderBottomColor: '#CCCCCC', // Border color for separation between settings items
    },
    label: {
      fontSize: 16,
      color: '#010100',
      padding: 10,
      marginBottom: 10,
      alignSelf: 'center',
      alignItems: 'center',
      justifyContent: 'center',
      borderBottomWidth: 1,
      borderBottomColor: '#CCCCCC', // Border color for separation between settings items
    },
    warning: {
      fontSize: 16,
      color: 'rgba(207,76,36,0.4)',
      padding: 10,
      marginBottom: 10,
      alignSelf: 'center',
      alignItems: 'center',
      justifyContent: 'center',
    },
    toggleContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    toggleButton: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderRadius: 10,
      paddingVertical: 10,
    },
    toggleButtonText: {
      fontSize: 16,
      color: '#333',
    },
    selectedButton: {
      backgroundColor: '#4fc3f7',
    },
    button: {
        padding: 10,
        marginBottom: 10,
        alignItems: 'center',
        justifyContent: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#CCCCCC',
      },
      buttonText: {
        fontSize: 16,
        color: '#333333', // Dark gray text color
      },
  });