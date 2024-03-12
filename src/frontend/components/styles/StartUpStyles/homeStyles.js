import { Dimensions, StyleSheet } from 'react-native';

const { width, height } = Dimensions.get('window');
const buttonWidth = width / 6; // Divide the screen width by the number of buttons per row
const buttonHeight = height / 5;

export const homeStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#BAEAFF',
  },
  topWidgetsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    position: 'absolute',
    top: 10,
    width: '100%',
    paddingHorizontal: 20,
  },
  drinksWidgetContainer: {
    position: 'absolute',
    top: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 10,
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
    // width: '100%', // Take up the full width to center horizontally
    // height: '100%', // Take up the full height to center vertically
  },
  beer: {
    width: 200,
    height: 200,
  },
    topContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 20,
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
    },
    
    chart: {
      marginTop: 10, // Adjust this value to control the spacing between the title and the chart
      marginBottom: 10, // Adjust this value to control the spacing between the chart and the buttons
      width: '80%', // Adjust the width as needed
      aspectRatio: 1.5, // Adjust the aspect ratio to control the height of the chart
    },
    container2: {
      flex: 1,
      justifyContent: 'space-between', // Distribute space between main sections
      alignItems: 'center',
      backgroundColor: '#fff',
    },
    smallIcon: {
      width: 50,
      height: 50,
      backgroundColor: 'transparent',
    },
    statsAndAchievementsContainer: {
      flexDirection: 'row', // Align items in a row
      justifyContent: 'space-between', // Space between items
      alignItems: 'center', // Align items vertically
      width: '100%', // Take the full width of the screen
      paddingHorizontal: 20, // Add some padding on the sides
      paddingTop: 20, // Add some padding on the top
  },
  
    achievementsButton: {
      flexDirection: 'row', // Align text and icon in a row
      alignItems: 'center', // Center items vertically
      backgroundColor: '#032585', // Example color, change as needed
      paddingVertical: 8,
      paddingHorizontal: 16,
      borderRadius: 20,
      elevation: 3,
  },
  
    achievementsButtonText: {
      marginRight: 10, // Add space between text and icon
      color: 'white',
      fontSize: 16,
      fontWeight: 'bold',
  },
    smallCircularButton: {
      width: 50,
      height: 50,
      borderRadius: 25, // Make it circular by setting borderRadius half of the width and height
      backgroundColor: '#032585', // Background color (change as needed)
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 20, // Add some space between buttons
      shadowColor: '#000', // Add shadow properties for a classy look
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.3,
      shadowRadius: 3.84,
      elevation: 5,
    },
    bottomContainer: {
      position: 'absolute', // Positions the container at the bottom of the screen
      bottom: 0, // Ensures it sticks to the bottom
      left: 0,
      right: 0,
      backgroundColor: 'transparent', // Optional: Makes the background of the container transparent
      padding: 10, // Adds some padding inside the container
    },
    buttonRow: {
      flexDirection: 'row',
      justifyContent: 'space-around', // This will distribute space evenly around each button
      alignItems: 'center',
      marginBottom: 10, // Adds a margin at the bottom if needed
    },
    topContainerRow: {
      flexDirection: "row",
      justifyContent: "flex-start",
      alignItems: "center",
    },
    drinkButtonContainer: {
      alignItems: 'center', // Center the beer jug and text
    },
    // recentDrinksContainer: {
    //   position: 'absolute',
    //   top: 10,
    //   right: 10,
    //   width: 200,
    //   backgroundColor: 'rgba(255, 255, 255, 0.5)', // Semi-transparent white
    //   borderRadius: 10,
    //   padding: 10,
    //   elevation: 3,
    //   shadowColor: '#000',
    //   shadowOffset: { width: 0, height: 1 },
    //   shadowOpacity: 0.2,
    //   shadowRadius: 1.41,
    // },
    // commonDrinksContainer: {
    //   position: 'absolute',
    //   top: 10,
    //   left: 10,
    //   width: 200,
    //   backgroundColor: 'rgba(255, 255, 255, 0.5)', // Semi-transparent white
    //   borderRadius: 10,
    //   padding: 10,
    //   elevation: 3,
    //   shadowColor: '#000',
    //   shadowOffset: { width: 0, height: 1 },
    //   shadowOpacity: 0.2,
    //   shadowRadius: 1.41,
    // },
    
  });