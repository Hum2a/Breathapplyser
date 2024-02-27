import { StyleSheet } from "react-native";

export const addStyles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 30,
    backgroundColor: '#F0F0F0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
  },
  input: {
    width: '100%',
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
    backgroundColor: '#FFFFFF',
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginBottom: 10,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    textAlign: 'center',
  },
  timeText: {
    fontSize: 18, // A size that is easily readable
    color: '#333', // A color that contrasts well with the background, dark grey for professionalism
    fontFamily: 'Helvetica Neue', // A clean, professional font-family, choose one that suits your app
    textAlign: 'center', // Center align text, adjust as needed
    marginVertical: 10, // Provides space above and below the text
    paddingHorizontal: 10, // Provides horizontal padding
    borderWidth: 1, // Optional: Adds a border for more definition
    borderColor: '#ddd', // Optional: Light grey border color
    borderRadius: 5, // Optional: Rounds the corners of the border
    backgroundColor: '#fff', // A neutral background color, white
    shadowColor: '#000', // Optional: Adds a shadow for depth, adjust color as needed
    shadowOffset: { width: 0, height: 1 }, // Optional: Adjusts the shadow offset
    shadowOpacity: 0.2, // Optional: Adjusts the shadow visibility
    shadowRadius: 1.41, // Optional: Adjusts the blur radius of the shadow
    elevation: 2, // Optional: Adds elevation for Android (shadow equivalent)
  },
  priceInputContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start', // Align items to the start of the container
    alignItems: 'center',
    width: '100%', // Ensure the container takes the full width
  },
  currencyPicker: {
    position: 'absolute',
    top: 50,  // Adjust as needed
    left: 50,  // Adjust as needed
    width: 100,  // Adjust as needed
    height: 40,
    borderWidth: 1,
    borderColor: 'blue',
  },
  priceInput: {
    flex: 2, // Takes twice the space of currencyPicker
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginRight: 10, // Ensure there's some space between the input and the picker
    backgroundColor: '#FFFFFF',
  },
  priceUnitPicker: {
    width: 80,
  },
  amountSpentContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start', 
  },
  amountSpentText: {
    fontSize: 16,
    marginBottom: 5, 
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#F0F0F0',
  },
  statsContainer: {
    flexDirection: 'row', // Align items in a row
    justifyContent: 'space-around', // Space items evenly
    alignItems: 'center', // Align items vertically in the center
    backgroundColor: '#f7f7f7', // A light background color for the container
    paddingVertical: 10, // Vertical padding for the container
    paddingHorizontal: 20, // Horizontal padding for the container
    borderRadius: 5, // Optional: Rounds the corners of the container
    shadowColor: '#000', // Optional: Adds a shadow for depth, adjust color as needed
    shadowOffset: { width: 0, height: 1 }, // Optional: Adjusts the shadow offset
    shadowOpacity: 0.1, // Optional: Adjusts the shadow visibility
    shadowRadius: 1.41, // Optional: Adjusts the blur radius of the shadow
    elevation: 2, // Optional: Adds elevation for Android (shadow equivalent)
    marginVertical: 10, // Margin to separate from other elements
  },
  statText: {
    fontSize: 16, // A size that is easily readable
    color: '#333', // A color that contrasts well with the background
    fontFamily: 'Helvetica Neue', // A clean, professional font-family
  },
  saveEntryButton: {
    backgroundColor: '#ffbf00',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginBottom: 10,
  },
  saveEntryButtonText: {
    color: 'black',
    fontSize: 18,
    textAlign: 'center',
  },
  favouriteButton: {
    backgroundColor: 'pink',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginBottom: 10,
  },
  favouriteButtonText: {
    color: 'black',
    fontSize: 18,
    textAlign: 'center',
  },
  scanButton: {
    backgroundColor: '#2979FF', // Button background color
    padding: 10, // Padding around the button text
    borderRadius: 8, // Border radius to make the button rounded
    marginTop: 20, // Margin at the top to separate from other elements
  },
  scanButtonText: {
    color: 'white', // Button text color
    fontSize: 16, // Font size of the button text
    textAlign: 'center', // Center-align the text
  },
  
});
