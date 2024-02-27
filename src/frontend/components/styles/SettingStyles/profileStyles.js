import { StyleSheet } from "react-native";

export const profStyles = StyleSheet.create({
  fullScreen: {
    flex: 1,
    backgroundColor: '#BAEAFF', // Set your desired background color here
},
  container: {
    flex: 1,
    padding: 20,
    // backgroundColor: '#F0F0F0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    marginBottom: 5,
    color: '#666',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
  },
  unitPicker: {
    height: 40,
    backgroundColor: '#fff',
    borderRadius: 5,
  },
  bmiLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
    color: '#333',
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    borderRadius: 5,
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
  },
  clearButton: {
    backgroundColor: '#FF3B30',
    paddingVertical: 12,
    borderRadius: 5,
  },
  clearButtonText: {
    color: '#fff',
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
  },  
});
