import { StyleSheet, Dimensions } from "react-native";

const screenWidth = Dimensions.get('window').width;

export const drinkStyles = StyleSheet.create({
  iconContainer: {
    right: screenWidth/4,
    top: 2,
  },
  icon: {
    width: 60,
    height: 30,
  },
  switch: {
    right: 10
  },
  text: {
    color: 'black',
    fontFamily: 'my_coffee_break',
  }
})

export const manualStyles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 20,
    backgroundColor: '#F0F8FF',
  },
  title: {
    fontSize: 24,
    fontFamily: 'my_coffee_break',
    color: '#03396c', // Deep, contrast blue for titles
    textAlign: 'center',
    marginVertical: 20,
  },
  input: {
    width: '100%',
    height: 45,
    borderWidth: 1,
    borderColor: '#0392cf', // Bright, inviting blue for input borders
    borderRadius: 8,
    paddingHorizontal: 15,
    marginVertical: 10,
    backgroundColor: '#E3F2FD', // Very light blue for input background
    color: '#03396c', // Deep blue for input text for readability
  },
  button: {
    backgroundColor: '#0275d8', // Consistent, vibrant blue theme for buttons
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginVertical: 10,
    elevation: 2, // Subtle shadow for a "lifted" button effect on Android
    shadowColor: '#000', // Shadow for iOS
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  buttonText: {
    color: '#FFFFFF', // White for button text for strong contrast
    fontSize: 18,
    fontFamily: 'my_coffee_break',
    textAlign: 'center',
  },
  timeText: {
    fontSize: 20, // Slightly larger font size for emphasis
    fontWeight: '600', // Medium font weight for better readability
    color: '#005792', // A more striking blue for better visibility
    marginVertical: 15, // Increased spacing to make it stand out more
    paddingHorizontal: 15, // Slightly increased padding for a better touch area
    paddingVertical: 10, // Increased vertical padding for a balanced look
    backgroundColor: '#E1F5FE', // A softer blue background to make the text stand out
    borderRadius: 10, // Rounded corners for a modern look
    borderWidth: 2, // Slightly thicker border for prominence
    borderColor: '#0077B6', // Matching the blue theme with a vibrant border
    overflow: 'hidden', // Ensures the background does not bleed at the corners
    textAlign: 'center', // Center-align text for better focus
    elevation: 3, // Small shadow for a subtle depth effect (Android)
    shadowColor: '#000', // Shadow color for iOS
    shadowOffset: { width: 0, height: 2 }, // Shadow position for iOS
    shadowOpacity: 0.1, // Shadow opacity for iOS
    shadowRadius: 2, // Shadow blur radius for iOS
  },
  priceInputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
  },
  currencyPicker: {
    width: 110,
    height: 45,
    borderColor: '#0392cf',
    borderRadius: 8,
    backgroundColor: '#E3F2FD',
    color: 'navy',
    marginLeft: 10,
    fontFamily: 'my_coffee_break',
  },
  priceInput: {
    // Styles adjusted to match the rest of the inputs
    flex: 1,
    height: 45,
    borderColor: '#0392cf',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    backgroundColor: '#E3F2FD',
    color: '#03396c',
  },
  priceUnitPicker: {
    width: 80,
  },
  amountSpentContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#92DDFE', // Soft, light blue
  },
  amountSpentText: {
    fontSize: 16,
    color: '#003366', // Dark blue for text
    marginBottom: 5,
  },
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: '#F0F8FF', // Consistent background color for scrollable area
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#B3E5FC', // Soft, light blue for stats container background
    padding: 15,
    borderRadius: 10,
    marginVertical: 20,
  },
  statText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#03396c', // Deep blue for enhanced readability
  },
  saveEntryButton: {
    backgroundColor: '#0077B6', // Consistent blue theme for buttons
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginBottom: 10,
  },
  saveEntryButtonText: {
    color: '#FFFFFF', // White text for readability
    fontSize: 18,
    textAlign: 'center',
    fontFamily: 'my_coffee_break',
  },
  favouriteButton: {
    backgroundColor: '#005f73', // A darker shade of blue for contrast
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginBottom: 10,
  },
  favouriteButtonText: {
    color: '#FFFFFF', // White text for readability
    fontSize: 18,
    textAlign: 'center',
    fontFamily: 'my_coffee_break',
  },
  scanButton: {
    backgroundColor: '#2979FF', // A vibrant blue for the scan button
    padding: 10,
    borderRadius: 8,
    marginTop: 20,
  },
  scanButtonText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    fontFamily: 'my_coffee_break',
  },
  picker: {
    height: 45, // Matches the height of input fields for consistency
    borderWidth: 1, // Subtle border for definition
    borderColor: '#0392cf', // Bright, inviting blue that matches other input borders
    borderRadius: 8, // Rounded corners for a modern, friendly appearance
    paddingHorizontal: 10, // Padding for the internal text away from the edges
    marginVertical: 10, // Vertical spacing to match the layout rhythm
    backgroundColor: '#E3F2FD', // Very light blue for background, ensuring readability and theme consistency
    color: '#03396c', // Deep blue for the text, enhancing readability against the light background
    fontSize: 16, // Adequate font size for easy readability
    fontWeight: '500', // Medium weight for the text to make it slightly pronounced
  },
  pickerContainer: {
    height: 45,
    borderWidth: 1,
    borderColor: '#0392cf',
    borderRadius: 8,
    marginVertical: 10,
    overflow: 'hidden', // This ensures the borderRadius is applied
    backgroundColor: '#E3F2FD',
  },
  timeButton: {
    backgroundColor: 'black',
    padding: 8,
    alignItems: 'center',
    borderRadius: 20,
  } ,
  timeButtonText: {
    color: 'pink',
    fontSize: 14,
    fontFamily: 'my_coffee_break',
  }
});

export const autoStyles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    height: '100%',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#03396c', // Deep blue title text
    textAlign: 'center',
    marginVertical: 20,
  },
  inputContainer: {
    backgroundColor: '#E3F2FD', // Lighter blue input container
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  drinkContainer: {
    marginBottom: 5,
  },
  drinkText: {
    color: '#03396c', // Deep blue drink text
    marginBottom: 5,
  },
  drinkNameText: {
    color: '#03396c', // Deep blue drink text
    marginBottom: 5,
    fontFamily: 'my_coffee_break',
  },
  priceInput: {
    width: '100%',
    height: 45,
    borderWidth: 1,
    borderColor: '#0392cf', // Bright blue input borders
    borderRadius: 8,
    paddingHorizontal: 15,
    backgroundColor: '#E3F2FD', // Light blue input background
    color: '#03396c', // Deep blue input text
  },
  buttonContainer: {
    flexDirection: 'row',
    alignContent: 'center',
    justifyContent: 'center',
  },
  button: {
    backgroundColor: '#0275d8', // Darker blue button
    borderRadius: 8,
    elevation: 2,
    height: 50,
    width: 65,
    marginLeft: 1,
    justifyContent: 'center',
  },
  buttonText: {
    color: '#FFFFFF', // White button text
    fontSize: 14,
    fontFamily: 'my_coffee_break',
    textAlign: 'center',
  },
  timeText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#005792', // Brighter blue time text
    marginVertical: 15,
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#E1F5FE', // Lighter blue background for time text
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#0077B6', // Darker blue border
    overflow: 'hidden',
    textAlign: 'center',
    elevation: 3,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#B3E5FC', // Light blue stats container background
    padding: 15,
    borderRadius: 10,
    marginVertical: 20,
  },
  statText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#03396c', // Deep blue stat text
  },
  doubleToggleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  doubleToggle: {
    backgroundColor: '#DDDDDD',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  doubleToggleActive: {
    backgroundColor: '#0275d8',
  },
  doubleToggleText: {
    color: '#333333',
    fontFamily: 'my_coffee_break',
  },
  doubleToggleTextActive: {
    color: '#FFFFFF',
    fontFamily: 'my_coffee_break',
  },
  selectedButton: {
    backgroundColor: '#0056b3', // A darker or different color to indicate selection
    borderColor: '#004080', // Optional: add a border color if needed
    borderWidth: 2, // Optional: border width
  },
  selectedButtonText: {
    color: '#FFFFFF', // Adjust as needed
  },
  drinkTypeContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backgroundTextContainer: {
    ...StyleSheet.absoluteFillObject, // Make the text overlay the entire item
    position: 'absolute',
    left: -10, // Align to the left side
    justifyContent: 'flex-start', // Center vertically
    alignItems: 'flex-end', // Align text to the start (left)
  },
  backgroundText: {
    fontSize: 68, // Large text size
    color: 'rgba(0, 0, 255, 0.2)', // Semi-transparent white
    transform: [{ rotate: '10deg' }], // Rotate the container
    fontFamily: 'my_coffee_break',
    textAlign: 'center',
    zIndex: 1,
    overflow: 'hidden', // Hide any part of the text that overflows the container
  },
  dialogContainer: {
    padding: 20,
    backgroundColor: '#ffffff', // white background for the dialog
    borderRadius: 8,
    elevation: 5, // for shadow on Android
    shadowColor: '#000000', // shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  dialogTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#03396c', // consistent deep blue color
    marginBottom: 10, // space between title and content
  },
  dialogDescription: {
    fontSize: 16,
    color: '#333333', // dark gray for text
    marginBottom: 20, // space before buttons
  },
  dialogButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginVertical: 5,
    backgroundColor: '#0275d8', // blue color for buttons
    borderRadius: 5,
    minWidth: 100, // ensure buttons have enough space
  },
  dialogButtonText: {
    textAlign: 'center',
    color: '#FFFFFF', // white text for buttons
    fontSize: 16,
  },
  dialogButtonCancel: {
    backgroundColor: '#cccccc', // grey color for cancel button
  },
});