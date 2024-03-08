import { StyleSheet } from "react-native";

export const addStyles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 30,
    backgroundColor: '#BAEAFF', // Lighter shade of blue for background
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#003366', // Dark blue for titles
    textAlign: 'center',
  },
  input: {
    width: '100%',
    height: 40,
    borderWidth: 1,
    borderColor: '#0077B6', // Bright blue for input borders
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
    backgroundColor: '#E7F2F8', // Very light blue for input background
    color: '#003366', // Use dark blue for input text for contrast
  },
  button: {
    backgroundColor: '#007AFF', // Preset, consider using a gradient if applicable
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginBottom: 10,
  },
  buttonText: {
    color: '#FFFFFF', // White for button text
    fontSize: 18,
    textAlign: 'center',
  },
  timeText: {
    fontSize: 18,
    color: '#003366', // Dark blue for time texts
    marginVertical: 10,
    paddingHorizontal: 10,
    backgroundColor: '#E7F2F8', // Very light blue background for time texts
    borderRadius: 5,
  },
  priceInputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  currencyPicker: {
    width: 100,
    height: 40,
    borderColor: '#0077B6', // Bright blue border
    borderRadius: 5,
    marginLeft: 10,
    backgroundColor: '#E7F2F8', // Very light blue for picker background
  },
  priceInput: {
    flex: 1,
    height: 40,
    borderColor: '#0077B6', // Bright blue for input borders
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    backgroundColor: '#E7F2F8', // Very light blue for input background
    color: '#003366', // Dark blue for input text
  },
  priceUnitPicker: {
    width: 80,
  },
  amountSpentContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#92DDFE', // Soft, light blue
  },
  amountSpentText: {
    fontSize: 16,
    color: '#003366', // Dark blue for text
    marginBottom: 5,
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#BAEAFF', // Consistent light blue background for scrollable area
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#92DDFE', // Soft, light blue for stats container background
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  statText: {
    fontSize: 16,
    color: '#003366', // Dark blue for stats text
  },
  saveEntryButton: {
    backgroundColor: '#0077B6', // Consistent blue theme for buttons
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginBottom: 10,
  },
  saveEntryButtonText: {
    color: '#FFFFFF', // White text for readability
    fontSize: 18,
    textAlign: 'center',
  },
  favouriteButton: {
    backgroundColor: '#005f73', // A darker shade of blue for contrast
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginBottom: 10,
  },
  favouriteButtonText: {
    color: '#FFFFFF', // White text for readability
    fontSize: 18,
    textAlign: 'center',
  },
  scanButton: {
    backgroundColor: '#2979FF', // A vibrant blue for the scan button
    padding: 10,
    borderRadius: 8,
    marginTop: 20,
  },
  scanButtonText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
});
