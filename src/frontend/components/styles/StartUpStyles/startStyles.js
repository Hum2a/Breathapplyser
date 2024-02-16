import { StyleSheet } from "react-native";

export const StartStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0', // Background color
    padding: 20,
  },
  button: {
    width: 200,
    height: 50,
    borderRadius: 25,
    marginVertical: 10,
    marginHorizontal: 10,
    marginBottom: 20,
    elevation: 5,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    backgroundColor: 'blue',
  },
  registerButton: {
    backgroundColor: 'transparent', // Transparent background for the bubbly effect
    borderWidth: 2, // Add a border to make it appear bubbly
    borderColor: 'blue', // Color of the border
  },
  loginButton: {
    backgroundColor: 'transparent', // Transparent background for the bubbly effect
    borderWidth: 2, // Add a border to make it appear bubbly
    borderColor: 'purple', // Color of the border
  },
  homeButton: {
    backgroundColor: 'transparent', // Transparent background for the bubbly effect
    borderWidth: 2, // Add a border to make it appear bubbly
    borderColor: 'green', // Color of the border
  },
  buttonText: {
    fontSize: 18,
    color: '#000', // Change text color to make it visible
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
