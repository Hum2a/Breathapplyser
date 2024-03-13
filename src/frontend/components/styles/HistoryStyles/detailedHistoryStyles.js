import { StyleSheet, Dimensions } from 'react-native';

const screenWidth = Dimensions.get('window').width;

export const DetailedHistoryStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#BAEAFF', // Light blue background to keep consistency with the app theme
    paddingVertical: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 20,
    color: '#003366', // Deep blue for a striking contrast
    textAlign: 'center',
  },
  chartContainer: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    elevation: 2, // Add shadow for depth
    marginBottom: 20,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#005f73', // A darker blue for the chart title
    marginBottom: 10,
  },
  entryItem: {
    backgroundColor: '#E1F5FE', // Adjust as needed
    padding: 16,
    borderRadius: 8,
    marginVertical: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
    width: screenWidth - 32,
    alignSelf: 'center',
  },
  entryRow: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  entryText: {
    fontSize: 16,
    color: '#005792', // Use a blue tone that's easy to read
    marginBottom: 1,
    fontWeight: '500', // Slightly bolder text for better readability
  },
  entryLabel: {
    fontWeight: 'bold',
  },
  entryValue: {
    fontStyle: 'italic',
  },
});
