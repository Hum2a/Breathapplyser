import { StyleSheet } from 'react-native';


export const cnoStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgb(190,233,205)', // Consistent light blue background
    padding: 15,
  },
  title: {
    fontSize: 24,
    fontFamily: 'my_coffee_break',
    color: '#003366', // Dark blue for better contrast and readability
    textAlign: 'center',
    marginBottom: 20,
    paddingVertical: 10,
    borderBottomWidth: 2,
    borderBottomColor: '#0077B6', // A brighter shade of blue for the underline
  },
  dateText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#003366', // Dark blue for better contrast and readability
    textAlign: 'center',
    marginLeft: 10,
    marginTop: 5,
  },
  statContainer: {
    backgroundColor: '#92DDFE', // A softer, lighter blue for containers
    marginVertical: 8,
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
    marginBottom: 20,
  },
  statText: {
    fontSize: 16,
    color: '#003366', // Dark blue for text to maintain readability
    marginBottom: 5,
  },
  limitText: {
    fontSize: 18,
    color: '#FF3B30', // Red for limits to draw attention
    fontFamily: 'my_coffee_break'
  },
  bacText: {
    fontSize: 18,
    color: '#003366', // Dark blue for text, similar to statText for consistency
    fontFamily: 'my_coffee_break',
    marginTop: 10,
  },
  barChartContainer: {
    marginVertical: 20,
    borderRadius: 16,
    padding: 16,
    backgroundColor: '#92DDFE', // Light blue to maintain theme consistency
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  linechartContainer: {
    marginVertical: 20,
    borderRadius: 16,
    backgroundColor: '#92DDFE', // Using the same light blue as barChartContainer for consistency
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  chartTitle: {
    fontSize: 18,
    color: '#003366', // Dark blue for titles within chart containers
    marginBottom: 10,
    fontFamily: 'my_coffee_break',
  },
  button: {
    backgroundColor: '#FF6347', // Tomato red
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25, // Increased border radius for a rounder look
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    // Add some gradient effect
    backgroundImage: 'linear-gradient(45deg, #FFA07A, #FF6347)', // Gradient from light coral to tomato
    // Add some extra styles for text inside the button
    color: 'white', // Text color
    fontSize: 16,
    fontWeight: 'bold',
    textTransform: 'uppercase', // Uppercase text
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
    fontFamily: 'my_coffee_break',
  },
  dateItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc', // Light grey for a subtle separation
    backgroundColor: '#E7F2F8', // Very light blue for individual date items
  },
  dateItemText: {
    fontSize: 18,
    color: '#003366', // Dark blue for readability
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: '#92DDFE', // Soft light blue for modal background
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalItemContainer: {
    backgroundColor: '#D4E6F1', // Light blue for modal item background
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 15,
    marginVertical: 10,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalItemText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#003366', // Dark blue for readability
  },
  closeButton: {
    backgroundColor: '#FF6347', // Tomato red
    borderRadius: 25, // Increased border radius for a rounder look
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  closeButtonText: {
    color: 'white', // Text color
    fontSize: 16,
    fontWeight: 'bold',
    textTransform: 'uppercase', // Uppercase text
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  chartContainer: {
    marginTop: 10,
    marginBottom: 20,
  },
  switchContainer: {
    flexDirection: 'row', // Align label and switch horizontally
    justifyContent: 'center', // Center the content
    alignItems: 'center', // Align items vertically
    marginBottom: 20, // Adds some space below the switch
  },
  switchLabel: {
    fontSize: 18, // Size of the label text
    color: '#333', // Color of the text
    marginRight: 10, // Adds some space between the label and the switch
  },
  subHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20, // Adjust as needed
    marginBottom: 10,
  },
  subHeaderText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  dataRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  dataText: {
    fontSize: 16,
    color: '#333',
  },
  dataLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20, // Space between legend items
  },
  legendIndicator: {
    width: 10, // Width of the color indicator
    height: 10, // Height of the color indicator
    borderRadius: 5, // Make it circular
    marginRight: 5, // Space between indicator and text
  },
  legendText: {
    fontSize: 14, // Adjust to your preference
    color: '#333', // Adjust to your preference
  },
  flatListContainer: {
    flex: 1, // Take up all available space
    backgroundColor: '#E7F2F8', // Very light blue for the FlatList background
    borderRadius: 10, // Match modal's rounded corners
    padding: 10, // Space around the FlatList items
    // Add shadow or border if needed to match your design preference
  },  
  iconContainer: {
    position: 'absolute', // Position the button absolutely relative to its parent
    top: -24, // Distance from the top of the parent container
    left: -10, // Distance from the left of the parent container
    padding: 10, // Add padding for easier tapping
},
  icon: {
    width: 40, // Set a fixed width for your icon
    height: 40, // Set a fixed height for your icon
    resizeMode: 'contain' // Ensure the icon scales properly
},
  modalContainer: {
    flex: 1,
    backgroundColor: '#ffffff', // Bright background for the modal
    borderRadius: 20, // Rounded corners
    padding: 20, // Padding around the inner content
    alignItems: 'center', // Center content horizontally
    justifyContent: 'center', // Center content vertically
    shadowColor: '#000', // Black shadow for depth
    shadowOffset: { width: 0, height: 2 }, // Shadow position
    shadowOpacity: 0.25, // Shadow opacity
    shadowRadius: 3.84, // Shadow blur radius
    elevation: 5, // Elevation for Android
  },
  input: {
    height: 40, // Set the height of the input field
    margin: 12, // Margin around the input field
    borderWidth: 1, // Border width for the input field
    padding: 10, // Padding inside the input field for text
    backgroundColor: '#FFFFFF', // Set the background color to white
    borderColor: '#0077B6', // A brighter shade of blue for the border
    borderRadius: 10, // Rounded corners for the input field
    color: '#003366', // Text color
    fontSize: 16, // Font size for the input text
    fontWeight: 'normal', // Font weight
  },
  modalTitle: {
    fontSize: 20, // Slightly larger for emphasis
    fontWeight: 'bold', // Make it bold to stand out
    color: '#003366', // Using the same dark blue for consistency with other titles
    textAlign: 'center', // Center the title text
    marginBottom: 10, // Margin at the bottom to separate from the content
},


});

// Styles for the FlatList and available dates
export const flatListStyles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10, // Padding for the list's horizontal sides
    paddingVertical: 10, // Padding for the list's vertical sides
  },
  dateItem: {
    paddingVertical: 15, // Vertical padding for each item
    paddingHorizontal: 10, // Horizontal padding for each item
    borderBottomWidth: 1,
    borderBottomColor: '#0077B6', // A darker shade of blue for the underline
    backgroundColor: '#ffffff', // White background for each item
    marginBottom: 5, // Space between items
    borderRadius: 10, // Rounded corners for each item
    shadowColor: '#000', // Black shadow for depth
    shadowOffset: { width: 0, height: 1 }, // Shadow position
    shadowOpacity: 0.22, // Shadow opacity
    shadowRadius: 2.22, // Shadow blur radius
    elevation: 3, // Elevation for Android
  },
  dateText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#003366', // Dark blue for readability
    textAlign: 'center', // Center text
  },
});

