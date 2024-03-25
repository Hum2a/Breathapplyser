import { Dimensions, StyleSheet } from "react-native";

const screenWidth = Dimensions.get('window').width;

export const limitStyles = StyleSheet.create({
  fullScreen: {
    flex: 1,
    backgroundColor: '#e1f5fe',
  },
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#0277bd',
    textAlign: 'center',
  },
  limitContainer: {
    marginBottom: 30,
  },
  limitInnerContainer: {
    alignItems: 'center',
  },
  label: {
    fontSize: 18,
    color: '#0277bd',
    marginBottom: 10,
  },
  slider: {
    width: '100%',
  },
  button: {
    backgroundColor: '#29b6f6',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#29b6f6',
    borderRadius: 5,
    width: '100%',
    padding: 10,
    marginBottom: 20,
    color: '#0277bd',
  },
  confirmButton: {
    backgroundColor: '#29b6f6',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  strictnessButton: {
    padding: 10,
    margin: 5,
    borderRadius: 5,
  },
  strictnessButtonText: {
    color: '#FFF',
  },  
});