import { StyleSheet } from "react-native";

export const barcodeStyles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    camera: {
      flex: 1,
      width: '100%',
    },
    barcodeContainer: {
      position: 'absolute',
      bottom: 0,
      width: '100%',
      padding: 10,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    barcodeText: {
      color: 'white',
      fontSize: 16,
      textAlign: 'center',
    },
    button: {
      padding: 10,
      backgroundColor: '#2196F3',
      borderRadius: 5,
      marginTop: 10,
    },
    buttonText: {
      color: 'white',
      fontSize: 16,
      textAlign: 'center',
    },
  });