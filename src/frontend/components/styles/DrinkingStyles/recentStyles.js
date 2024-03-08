import { StyleSheet, Dimensions } from 'react-native';

const screenWidth = Dimensions.get('window').width;

export const RecentStyles = StyleSheet.create({
  container: {
    padding: 10,
    borderRadius: 10,
    margin: 10,
    maxHeight: 250,
    maxWidth: screenWidth * 0.5,
    // backgroundColor: '#92DDFE',
    // borderColor: 'gold',
    // borderWidth: 0.5,
    backgroundColor: 'transparent',
  },
  listItem: {
    backgroundColor: 'rgba(249, 249, 249, 0.5)', // Making background slightly transparent
    marginVertical: 6,
    borderRadius: 5,
    padding: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.20,
    shadowRadius: 1.41,
    elevation: 2,
  },
  
  text: {
    fontSize: 14, // Reduced font size
    color: '#333', // Dark color for text for readability
  },
  title: {
    fontSize: 20, // Slightly smaller font size for title
    fontWeight: 'bold', // Make the title bold
    color: '#333', // Dark color for text for readability
    marginBottom: 2, // Reduced margin at the bottom for spacing
    textAlign: 'center',
  },
  buttonText: {
    fontSize: 14, // Reduced font size for button text
    color: 'white',
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#007bff', // A nice shade of blue for buttons
    padding: 8, // Reduced padding for buttons
    borderRadius: 5,
    marginVertical: 8, // Reduced margin at the top and bottom for buttons
  }
});
