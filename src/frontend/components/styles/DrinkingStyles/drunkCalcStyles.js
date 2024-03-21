import { StyleSheet } from "react-native";

export  const DrunkCalcStyles = StyleSheet.create({
    centeredView: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(0,0,0,0.5)",
    },
    modalView: {
      margin: 20,
      backgroundColor: "white",
      borderRadius: 20,
      padding: 35,
      alignItems: "center",
      justifyContent: 'center',
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
      width: '80%',
      height: '25%',
    },
    hideButton: {
      backgroundColor: "#2196F3",
      borderRadius: 20,
      padding: 10,
      elevation: 2,
      marginTop: 15,
    },
    textStyle: {
      color: "white",
      fontWeight: "bold",
      textAlign: "center"
    },
    modalText: {
      marginBottom: 15,
      textAlign: "center"
    },
    boldText: {
      fontWeight: 'bold',
    },
    bacLevelText: {
      textAlign: 'center',
      marginTop: 5,
      fontSize: 14,
      color: '#666', // A neutral, readable color
    },
    bacLevelNumber: {
      textAlign: 'center',
      fontWeight: 'bold',
      color: '#000', // Bold and standout color
    },
  });