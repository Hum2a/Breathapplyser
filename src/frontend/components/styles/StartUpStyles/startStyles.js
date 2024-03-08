import { StyleSheet, Dimensions } from "react-native";

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export const StartStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ADD8E6', // Light blue background color
    padding: 20,
  },
  title: {
    fontSize: 36, // Larger font size for the title
    fontWeight: 'bold',
    color: '#005f73', // A contrasting darker blue for better readability
    marginBottom: 60, // Increase spacing before the buttons start
    textAlign: 'center',
  },
  button: {
    width: 200,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    elevation: 5,
  },
  buttonText: {
    fontSize: 18,
    color: '#FFFFFF', // Ensure text color contrasts well with the gradient
    fontWeight: 'bold',
  },
});
