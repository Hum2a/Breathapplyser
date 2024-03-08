import { StyleSheet } from 'react-native';

export const cnoStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#BAEAFF', // Consistent light blue background
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#003366', // Dark blue for better contrast and readability
    textAlign: 'center',
    marginBottom: 20,
    paddingVertical: 10,
    borderBottomWidth: 2,
    borderBottomColor: '#0077B6', // A brighter shade of blue for the underline
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
    fontWeight: 'bold',
  },
  bacText: {
    fontSize: 18,
    color: '#003366', // Dark blue for text, similar to statText for consistency
    fontWeight: 'bold',
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
  },
  button: {
    backgroundColor: '#007AFF', // Consistent theme blue
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
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
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonClose: {
    backgroundColor: "#2196F3", // Slightly different shade of blue for the close button
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
});
