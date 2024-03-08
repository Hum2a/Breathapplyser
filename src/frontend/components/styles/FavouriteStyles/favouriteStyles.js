import { StyleSheet } from 'react-native';

export const favouriteStyles = StyleSheet.create({
  container: {
    backgroundColor: '#BAEAFF', // A lighter shade of blue for background
    padding: 10,
    marginBottom: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#0077B6', // A brighter blue for border, providing contrast
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
    backgroundColor: '#FF3B30', // Red color for delete button to stand out for caution
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    alignSelf: 'flex-end',
  },
  deleteButtonText: {
    color: 'white',
    fontWeight: 'bold',
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
  },
  addNewFavouriteButtonText: {
    color: 'white', // White text for clarity and contrast
    fontWeight: 'bold',
    fontSize: 18,
    textAlign: 'center',
  },
});
