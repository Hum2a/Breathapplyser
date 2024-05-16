import { StyleSheet } from "react-native";

export const DisplayStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#b6e6fd',
      paddingTop: 20,
      paddingHorizontal: 20,
    },
    header: {
      fontSize: 26,
      marginBottom: 20,
      color: '#333',
      textAlign: 'center',
      color: '#062376',
      fontFamily: 'my_coffee_break',
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
      fontFamily: 'my_coffee_break',
    },
    label: {
      fontSize: 20,
      color: '#010100',
      padding: 10,
      marginBottom: 10,
      alignSelf: 'center',
      alignItems: 'center',
      justifyContent: 'center',
      borderBottomWidth: 1,
      borderBottomColor: '#CCCCCC', // Border color for separation between settings items
      fontFamily: 'heyam',
    },
    warning: {
      fontSize: 16,
      color: 'rgba(207,76,36,0.4)',
      padding: 10,
      marginBottom: 10,
      alignSelf: 'center',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'heyam',
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
      fontFamily: 'heyam',
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
        fontSize: 20,
        color: '#333333',
        fontFamily: 'heyam',
      },
      toggleAllButton: {
        backgroundColor: '#4fc3f7',
        borderColor: '#000',
        padding: 10,
        borderRadius: 5,
        borderWidth: 1,
        alignItems: 'center',
        marginVertical: 10,
        marginHorizontal: 10,
      },
      toggleAllButtonText: {
        color: '#FFFFFF',
        fontFamily: 'heyam',
      },
      toggleAllContainer: {
        flexDirection: 'row',
        alignSelf:'center',
      }
  });