import { StyleSheet } from 'react-native';

export const cnoStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F0F0',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
    paddingVertical: 10,
    borderBottomWidth: 2,
    borderBottomColor: '#007AFF',
  },
  statContainer: {
    backgroundColor: '#FFFFFF',
    marginVertical: 8,
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    elevation: 2,
    marginBottom: 20,
  },
  statText: {
    lineHeight: 24,
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
  },
  limitText: {
    fontSize: 18,
    color: 'red', // Red color for emphasis on limits
    lineHeight: 24,
    fontWeight: 'bold',
  },
  bacText: {
    fontSize: 18,
    color: '#333',
    lineHeight: 24,
    marginTop: 10,
    fontWeight: 'bold',
    textAlign: 'right',
  },
  barChartContainer: {
    marginVertical: 20, // Add some vertical space around the chart
    alignItems: 'center', // Center the chart
    borderRadius: 10, // Optional: Rounds the corners of the chart container
    backgroundColor: '#fff', // Optional: Sets a background color for the chart container
  },
  linechartContainer: {
    marginVertical: 20,
    alignItems: 'center',
    borderRadius: 16,
    backgroundColor: '#fff',
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  chartTitle: {
    fontSize: 18,
    color: '#333',
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#007AFF', // A pleasant blue color
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center', // Center text horizontally
    justifyContent: 'center', // Center text vertically
    marginVertical: 10, // Adds margin from top and bottom
    shadowColor: '#000', // Optional: Adds a shadow for depth, adjust color as needed
    shadowOffset: { width: 0, height: 1 }, // Optional: Adjusts the shadow offset
    shadowOpacity: 0.2, // Optional: Adjusts the shadow visibility
    shadowRadius: 1.41, // Optional: Adjusts the blur radius of the shadow
    elevation: 2, // Optional: Adds elevation for Android (shadow equivalent)
  },
  buttonText: {
    color: '#FFFFFF', // White color for the text
    fontSize: 18, // Size of the text
    textAlign: 'center', // Center text
  },
  dateItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  dateItemText: {
    fontSize: 18,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
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
    elevation: 5
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
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
  
  
  
  
});
