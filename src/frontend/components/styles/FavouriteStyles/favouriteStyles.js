import { StyleSheet } from 'react-native';

export const favouriteStyles = StyleSheet.create({
  fullscreen: {
    backgroundColor: '#BAEAFF',
  },
  flatlistContainer: {
    backgroundColor: '#BAEAFF',
    alignItems: 'center',
    marginBottom: 20, 
  },
  starView: {
    position: 'relative',
  },
  container: {
    backgroundColor: '#BAEAFF', // A lighter shade of blue for background
    flex: 1,
  },
  infoContainer: {
    marginBottom: 5,
  },
  categoryText: {
    fontWeight: 'bold',
    fontStyle: 'italic',
    fontSize: 18,
    color: '#005f73', // A darker blue for text, ensuring readability
  },
  detailsText: {
    fontSize: 16,
    color: '#003366', // Even darker blue for more important details, enhancing contrast
    marginBottom: 5,
  },
  deleteButton: {
    backgroundColor: 'transparent', // Red color for delete button to stand out for caution
    paddingHorizontal: 5,
    paddingVertical: 5,
    borderRadius: 5,
    // borderColor: 'red',
    // borderWidth: 1,
    left: 18,
    alignSelf: 'flex-end',
  },
  deleteButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  binIcon: {
    width: 60,
    height: 60,
    backgroundColor: 'transparent',
    alignSelf: 'center',
    margin: 1,
  },
  entry: {
    marginBottom: 20,
  },
  starContent: {
    alignItems: 'center', 
    justifyContent: 'center', 
  },
  pulsatingBorder: {
    position: 'absolute',
    width: "110%", 
    height: "110%", 
    borderRadius: 100, 
    backgroundColor: 'transparent', 
    justifyContent: 'center',
    alignItems: 'center',
  },
  addNewFavouriteButton: {
    backgroundColor: '#0077B6', // A consistent blue theme for action buttons
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 50,
    borderColor: '#005f73', // A slightly darker blue for border, adding depth
    borderWidth: 2,
    marginBottom: 10,
    marginTop: 5,
    width: '75%',
    alignSelf: 'flex-end',
  },
  addNewFavouriteButtonText: {
    color: 'white', // White text for clarity and contrast
    fontWeight: 'bold',
    fontSize: 18,
    textAlign: 'center',
  },
  refreshButton: {
    padding: 10,
    margin: 10,
    backgroundColor: 'transparent',
    alignItems: 'center',
  },
  updateButtonImage: {
    width: 30,
    height: 30,
  },
  pickerContainer: {
    backgroundColor: '#f0f4f8', // Light greyish background for the picker container
    padding: 10,
    marginHorizontal: 20,
    borderRadius: 10,
    borderColor: '#ccc', // Light grey border
    borderWidth: 1,
    width: '50%',
  },
  picker: {
    height: 50, // Fixed height for picker
    width: '100%', // Full width within the container
    color: '#005f73', // Text color to match category text
  },
  pickerContainer2: {
    backgroundColor: '#f0f4f8', // Light greyish background for the picker container
    padding: 10,
    borderRadius: 10,
    borderColor: '#ccc', // Light grey border
    borderWidth: 1,
    width: '100%',
  },
  pickerText: {
    textAlign: 'center',
    color: '#005f73',
    fontSize: 14,
    fontWeight: 'bold'
  },
  venueButton: {
    backgroundColor: '#0077B6', // A consistent blue theme for action buttons
    paddingVertical: 12,
    borderRadius: 50,
    borderColor: '#005f73', // A slightly darker blue for border, adding depth
    borderWidth: 2,
    marginBottom: 10,
    marginTop: 5,
    width: '40%',
  },
  venueButtonText: {
    color: 'white', // White text for clarity and contrast
    fontWeight: 'bold',
    fontSize: 18,
    textAlign: 'center',
  },
  venueContainer: {
    flexDirection: 'row',
    alignSelf: 'center',
  }
});

export const dialogStyles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0277BD', // Light blue
    marginBottom: 15,
  },
  description: {
    fontSize: 16,
    color: '#004C8C', // Slightly darker blue for contrast
    marginBottom: 20,
  },
  buttonLabel: {
    fontSize: 18,
    fontWeight: '500',
  },
  cancelButton: {
    color: '#CDDC39', // Yellowish-green for the cancel button
  },
  deleteButton: {
    color: '#F44336', // Red for the delete button
  },
  input: {
    height: 45, // Consistent height for inputs
    backgroundColor: '#FFFFFF', // White background
    color: '#0277BD', // Light blue text to match the theme
    borderWidth: 1, // Border to enhance visibility
    borderColor: '#004C8C', // Border color matching description
    borderRadius: 8, // Rounded corners
    paddingHorizontal: 10, // Horizontal padding
    fontSize: 16, // Font size that matches the description
  }
});

