import { StyleSheet, Dimensions } from "react-native";

export const NameStyles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
    borderRadius: 10,
    backgroundColor: 'transparent', // Consistent light blue background
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
  pickersContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
    backgroundColor: 'red',
  },
  pickerStyle: {
    flex: 1,
    height: 50,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    marginRight: 10,
    alignSelf: 'center',
    color: 'black',
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
