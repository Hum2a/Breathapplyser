import { StyleSheet } from 'react-native';

export const favouriteStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#9CEEF1',
    padding: 10,
    marginBottom: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  infoContainer: {
    marginBottom: 5,
  },
  categoryText: {
    fontWeight: 'bold',
    fontStyle: 'italic',
    fontSize: 18,
    color: 'black',
  },
  detailsText: {
    fontSize: 16,
    marginBottom: 5,
  },
  deleteButton: {
    backgroundColor: 'red',
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
    alignItems: 'center', // Center content horizontally in the star
    justifyContent: 'center', // Center content vertically in the star
    // Adjust padding as needed to fit your star shape
  },
  pulsatingBorder: {
    position: 'absolute',
    width: "110%", // Adjust based on the size of your SVG
    height: "110%", // Adjust based on the size of your SVG
    borderRadius: 100, // Adjust for rounded corners, if desired
    backgroundColor: 'transparent', // Or any color for the border
    justifyContent: 'center',
    alignItems: 'center',
  },
  addNewFavouriteButton: {
    backgroundColor: '#9CEEF1',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 50,
    borderColor: 'black',
    borderwidth: 2,
    marginBottom: 10,
    marginTop: 5,
  },
  addNewFavouriteButtonText: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 18,
    textAlign: 'center',
  },
});
