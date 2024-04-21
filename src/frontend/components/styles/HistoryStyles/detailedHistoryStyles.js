import { StyleSheet, Dimensions } from 'react-native';

const screenWidth = Dimensions.get('window').width;

export const DetailedHistoryStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#BAEAFF', // Light blue background to keep consistency with the app theme
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 20,
    color: '#003366', // Deep blue for a striking contrast
    textAlign: 'center',
    top: 10,
  },
  entryItem: {
    backgroundColor: '#E1F5FE', // Adjust as needed
    padding: 16,
    borderRadius: 8,
    marginVertical: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
    width: screenWidth - 32,
    alignSelf: 'center',
  },
  entryRow: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  entryText: {
    fontSize: 16,
    color: '#005792', // Use a blue tone that's easy to read
    marginBottom: 1,
    fontWeight: '500', // Slightly bolder text for better readability
  },
  entryLabel: {
    fontWeight: 'bold',
  },
  entryValue: {
    fontStyle: 'italic',
  },
  summaryContainer: {
    marginVertical: 20,
    padding: 15,
    backgroundColor: '#E1F5FE', // A light blue background to fit the theme
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
    // Add some spacing around the container
    marginHorizontal: 10,
  },
  
  summaryTitle: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 10,
    color: '#0277BD', // A darker blue for the title text to stand out
  },
  
  summaryText: {
    fontSize: 16,
    color: '#01579B', // Slightly darker blue for the summary text for better readability
    // Add some margin for a better layout
    marginBottom: 5,
  },

  buttonContainer: {
    position: 'absolute', 
    top: 10,
    right: 10,
    flexDirection: 'row', // This arranges the buttons in a row
    alignItems: 'center',
    justifyContent: 'space-between',
    width: 120, // Adjust this width based on your button sizing and spacing needs
},

button: {
    width: 34, 
    height: 34, 
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 17, // Half of width/height to make it round
    backgroundColor: '#81D4FA',
    elevation: 4, // Shadow for Android
    shadowColor: "#000", // Shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
},

buttonImage: {
    width: 24, 
    height: 24,
    resizeMode: 'contain', // Ensures the image fits within the button
},

});
