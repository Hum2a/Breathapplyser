import { StyleSheet } from "react-native";

export const amountSpentStyles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    // backgroundColor: '#BAEAFF', // Consistent light blue background
  },
  graphTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#003366', // Dark blue for contrast and readability
    marginBottom: 20,
  },
  toggleLabel: {
    fontSize: 18,
    color: '#003366', // Dark blue for contrast
    marginBottom: 10,
  },
  pickerStyle: {
    width: '80%',
    height: 40,
    marginBottom: 20,
    backgroundColor: '#E7F2F8', // Very light blue for subtle contrast
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#007AFF', // Theme consistent blue for the border
  },
  legendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  legendItem: {
    width: 14,
    height: 14,
    borderRadius: 7,
    marginRight: 5,
    backgroundColor: '#2979FF', // Example color, adjust as needed
  },
  legendLabel: {
    fontSize: 14,
    color: '#003366', // Dark blue for readability
  },
  noDataText: {
    fontSize: 16,
    color: '#003366', // Dark blue for readability
    marginTop: 20,
  },
  refreshButton: {
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
