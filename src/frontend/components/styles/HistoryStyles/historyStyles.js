import { StyleSheet } from 'react-native';

export const HistoryStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#BAEAFF',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    alignSelf: 'center',
  },
  calendarTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    alignSelf: 'center',
    marginVertical: 10,
  },
  calendar: {
    marginTop: 0,
    borderColor: 'lightgrey',
    borderWidth: 1,
  },
  historyItem: {
    backgroundColor: '#92DDFE', // Light blue background
    borderRadius: 8, // Rounded corners
    borderWidth: 1.5, // Border width
    borderColor: '#E9FAA6', // Yellowish-green border color
    padding: 20, // Padding inside the item
    margin: 10, // Margin around the item
    alignItems: 'center', // Center items horizontally
    // iOS shadow properties
    shadowColor: '#000', // Black color for the shadow
    shadowOffset: { width: 0, height: 2 }, // Shadow position
    shadowOpacity: 0.25, // Shadow opacity
    shadowRadius: 3.84, // Shadow blur radius
    // Android elevation
    elevation: 5, // Depth effect for Android
},

  dateText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  entriesCountText: {
    fontSize: 16,
    color: '#666',
  },
  weekHeader: {
    // Style for week header
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: '#f0faff', // Light blue background
    borderBottomWidth: 1,
    borderBottomColor: '#d6d7da', // Faint line color
  },
  weekHeaderText: {
    // Style for week header text
    color: '#0277bd', // Light blue theme color
    fontWeight: 'bold',
  },
  calendarIcon: {
    width: 50,
    height: 50,
    alignSelf: 'center',
  },
  backgroundTextContainer: {
    ...StyleSheet.absoluteFillObject, // Make the text overlay the entire item
    justifyContent: 'center', // Center vertically
    alignItems: 'center', // Center horizontally
    transform: [{ rotate: '-40deg' }], // Rotate the container
  },
  backgroundText: {
    fontSize: 73, // Large text size
    color: 'rgba(0, 0, 255, 0.2)', // Semi-transparent white
    fontWeight: 'bold',
    textAlign: 'center',
  },
  itemContent: {
    zIndex: 2, // Ensure the item content is above the background text
  },
  
});

export default HistoryStyles;
