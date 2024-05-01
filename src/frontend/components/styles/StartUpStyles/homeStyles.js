import { Dimensions, StyleSheet } from 'react-native';

const { width, height } = Dimensions.get('window');
const buttonWidth = width / 6; // Divide the screen width by the number of buttons per row
const buttonHeight = height / 5;

export const homeStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#00797B',
  },
  drinksWidgetContainer: {
    position: 'absolute',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '110%',
    paddingHorizontal: 10,
    bottom: 0,
  },
  commonDrinksContainer: {
    maxWidth: width * 0.4, // Set max width to 40% of screen width
    backgroundColor: 'rgba(21, 231, 212, 0.8)', // Adjust transparency as needed
    borderRadius: 10,
    padding: 10,
    elevation: 3,
  },
  recentDrinksContainer: {
    maxWidth: width * 0.4, // Set max width to 40% of screen width
    backgroundColor: 'rgba(255, 255, 255, 0.8)', // Adjust transparency as needed
    borderRadius: 10,
    padding: 10,
    elevation: 3,
  },
  beerContainer: {
    position: 'absolute', // Positioning it absolutely to ensure it stays in the center
    justifyContent: 'center',
    alignItems: 'center',
  },
  beer: {
    width: 250,
    height: 250,
  },
  buttonContainer: {
    width: buttonWidth,
    height: 100,
    backgroundColor: 'transparent',
    marginBottom: 20, // Add some space between buttons
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: 'black', // Text color (change as needed)
    fontSize: 18, // Font size (adjust as needed)
    fontWeight: 'bold', // Font weight (adjust as needed)
    fontFamily: 'Roboto',
    left: 10,
  },
  smallIcon: {
    width: 50,
    height: 50,
    backgroundColor: 'transparent',
  },
  wallet: {
    width: 80,
    height: 50,
    backgroundColor: 'transparent',
  },
  trackContainer: {
    flexDirection: "row",
    position: 'absolute',
    top: 5, // Adjust the top position to center it at the top of the screen
    alignSelf: 'center', // Center the container horizontally
    backgroundColor: '#ffffff', // Set a background color for the island
    borderRadius: 20, // Add border radius to create a rounded island shape
    padding: 10, // Add padding to the container
    zIndex: 999, // Adjust the z-index as needed
    shadowColor: '#000', // Add shadow properties for a more realistic effect
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  topRightContainer: {
    position: 'absolute',
    flexDirection: 'row',
    top: 50, // Adjust the top position as needed
    zIndex: 999, // Adjust the z-index as needed
    right: 1,
  },
  settingsIcon: {
    fontSize: 24, // Adjust the size of the icon as needed
    color: '#000', // Adjust the color of the icon as needed
  },
  topLeftContainer: {
    position: 'absolute',
    flexDirection: 'row',
    top: 50, // Adjust the top position as needed
    zIndex: 999, // Adjust the z-index as needed
    left: 1,
  },
  middleContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    zIndex: 999, // Adjust the z-index as needed
  },
  scrollContainer: {
    backgroundColor: 'transparent',
    justifyContent: 'center',
    right: width/6,
    bottom: 60,
  },
  starContainer: {
    backgroundColor: 'transparent',
    justifyContent: 'center',
    right: width/4 + 20,
    top: 60,
  },
  chartContainer: {
    width: buttonWidth,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    left: width/4 + 65,
    top: 60,
  },
  nightoutContainer: {
    width: buttonWidth,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    left: width/4,
    bottom: 60,
  },
  drunknessContainer: {
    justifyContent: 'center',
    position: 'absolute',
    top: 150,
    textAlign: 'center',
  },
  medalIcon: {
    width: 35,
    height: 35,
    marginRight: 2,
  },
  drunkennessContainer: {
    backgroundColor: '#ffffff', // Light gray, adjust as necessary
    padding: 15,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: 35, // Adjust the top position to center it at the top of the screen
  },
});