import { StyleSheet } from "react-native";

export const profStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#BAEAFF', // Light blue background for the container
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#005f73', // Darker blue for title text
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    alignSelf: 'center',
    marginBottom: 5,
    color: '#003366', // Dark blue for input labels
  },
  input: {
    height: 40,
    borderColor: '#0077B6', // Bright blue for input border
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    backgroundColor: '#E7F2F8', // Very light blue for input background
    color: '#003366', // Dark blue for input text
  },
  unitPicker: {
    height: 40,
    backgroundColor: '#E7F2F8', // Very light blue for picker background
    borderRadius: 5,
    color: '#003366', // Dark blue for picker text
  },
  bmiLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
    color: '#003366', // Dark blue for BMI label
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#007AFF', // Consistent blue for buttons
    paddingVertical: 12,
    borderRadius: 5,
    marginBottom: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF', // White text for buttons for contrast
    fontSize: 18,
    textAlign: 'center',
  },
  clearButton: {
    backgroundColor: '#62B1F6', // Lighter blue for the clear button, for differentiation
    paddingVertical: 12,
    borderRadius: 5,
    alignItems: 'center',
  },
  clearButtonText: {
    color: '#FFFFFF', // White text for clear button for contrast
    fontSize: 18,
    textAlign: 'center',
  },
  inputDualContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  inputDual: {
    flex: 1, // Make inputs take equal space
    marginHorizontal: 5, // Space between the inputs
    borderColor: '#0077B6', // Bright blue for input border
    backgroundColor: '#E7F2F8', // Very light blue for input background
    color: '#003366', // Dark blue for input text
  },
});
