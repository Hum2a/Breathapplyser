import { StyleSheet } from "react-native";

export const omniStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgb(190,233,205)', // Light blue background consistent with the app theme
  },
  button: {
    backgroundColor: 'rgba(0, 122, 255, 0.5)', // Use a transparent blue shade for buttons
    padding: 20,
    borderRadius: 10,
    marginVertical: 10,
    width: '80%',
    flexDirection: 'row', // Align text and icon horizontally
    justifyContent: 'space-between', // Distribute space evenly between text and icon
    alignItems: 'center', // Center items vertically
  },
  buttonText: {
    color: 'white',
    fontSize: 20,
    fontFamily: 'my_coffee_break',
    flex: 1, // Allow text to take up available space, pushing the icon to the edge
    textAlign: 'left', // Align text to the left
  },
  graphTitle: {
    fontSize: 32,
    fontFamily: 'my_coffee_break',
    color: '#003366', // Dark blue for better contrast and readability
    textAlign: 'center',
    marginBottom: 20,
    paddingVertical: 10,
  },
  smallIcon: {
    width: 60, // Specify icon size
    height: 60, // Specify icon size
    resizeMode: 'contain', // Ensure the entire icon is visible and proportionate
  },
});
