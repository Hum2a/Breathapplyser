import { StyleSheet } from 'react-native';

export const HistoryStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#00797B',
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
    margin: 10,
    borderWidth: 1.5,
    borderColor: '#E9FAA6',
    borderRadius: 10,
    overflow: 'hidden',
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
  topContainer: {
    alignContent: 'center',
    flexDirection: 'row',
    alignSelf: 'center'
  },
  backgroundTextContainer: {
    ...StyleSheet.absoluteFillObject, // Make the text overlay the entire item
    position: 'absolute',
    left: 0, // Align to the left side
    justifyContent: 'flex-start', // Center vertically
    alignItems: 'flex-start', // Align text to the start (left)
},

  backgroundText: {
    fontSize: 68, // Large text size
    color: 'rgba(0, 0, 255, 0.2)', // Semi-transparent white
    transform: [{ rotate: '-40deg' }], // Rotate the container
    fontWeight: 'bold',
    textAlign: 'center',
    zIndex: 1,
    overflow: 'hidden', // Hide any part of the text that overflows the container

  },
  itemContent: {
    flex: 1, // Take available space
    marginLeft: 180, // Give space for the date on the left, adjust as needed
    justifyContent: 'center', // Center items vertically inside
    paddingRight: 20, // Padding from the right edge
    zindex: 2,
  },
  gradient: {
    flex: 1,
    borderRadius: 8,
    padding: 20,
    justifyContent: 'center', // Align children vertically
    alignItems: 'center', // Align children horizontally
  },
  updateButton: {
    padding: 10,
    margin: 10,
    backgroundColor: 'transparent',
    alignItems: 'center',
  },
  updateButtonImage: {
    width: 30,
    height: 30,
  },
  
});

export default HistoryStyles;
