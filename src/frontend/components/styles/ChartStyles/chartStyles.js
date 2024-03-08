import { StyleSheet } from "react-native";

export const chartStyles = StyleSheet.create({
  fullScreen: {
    flex: 1,
    backgroundColor: '#BAEAFF', // Consistent light blue background
  },
  chartContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: '#E7F2F8', // A lighter shade for the inner container for subtle contrast
  },
  legendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    marginBottom: 20, // Ensure spacing around the legend
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10, // Space between legend items
  },
  legendColorBox: {
    width: 14,
    height: 14,
    marginRight: 5,
    backgroundColor: '#007AFF', // Example color, adjust as needed
    borderRadius: 2, // Slightly rounded corners for the color box
  },
  legendLabel: {
    fontSize: 14,
    color: '#003366', // Darker blue for text for better readability
  },
  intervalButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
    marginBottom: 20, // Added to ensure spacing around the interval buttons
  },
  intervalButton: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: '#007AFF', // Theme consistent blue for the border
    backgroundColor: '#BAEAFF', // Light blue for button background
    borderRadius: 5,
    marginRight: 5,
  },
  intervalButtonActive: {
    backgroundColor: '#005f73', // A darker blue for active button for contrast
  },
  xAxisLabelsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    marginTop: 5,
    marginBottom: 20, // Ensure there's space below the X-axis labels
  },
  xAxisLabel: {
    fontSize: 12,
    color: '#003366', // Consistent dark blue for readability
    transform: [{ rotate: '-45deg' }], // Maintain rotation for style
  },
});
  
export const toggleButtonStyles = StyleSheet.create({
  button: {
    backgroundColor: '#4CAF50', // Default background color
    padding: 10,
    borderRadius: 5,
    margin: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  buttonPressed: {
    backgroundColor: '#388E3C', // Darker shade when pressed
  },
});

export const comparisonChartStyles = StyleSheet.create({
  pickersContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#f5f5f5', // You can change this color as per your design
  },
  pickerStyle: {
    height: 50,
    width: 150,
    color: '#000', // Picker text color
  },
  chartContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  legendItem: {
    height: 10,
    width: 10,
    borderRadius: 5,
    marginRight: 5,
  },
  legendLabel: {
    fontSize: 12,
    marginRight: 15,
  }
});
