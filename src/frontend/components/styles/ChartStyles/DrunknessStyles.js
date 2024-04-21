import { StyleSheet } from 'react-native';

export const DrunkStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E0F2F1', // Light blue background color
    alignItems: 'center',
    justifyContent: 'center',
  },
  graphTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#1565C0', // Dark blue text color
  },
  pickersContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    alignSelf: 'center',
  },
  pickerStyle: {
    flex: 1,
    height: 50,
    backgroundColor: '#B3E5FC', // Light blue picker background color
    borderRadius: 10,
    marginRight: 10,
    alignSelf: 'center',
  },
  legendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    alignSelf: 'center',
  },
  legendItem: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 5,
    alignSelf: 'center',
  },
  legendLabel: {
    fontSize: 14,
    color: '#1565C0', // Dark blue legend text color
    alignSelf: 'center',
  },
  drunknessLevelContainer: {
    flexDirection: 'row',
    marginBottom: 5,
    backgroundColor: '#B3E5FC', // Light blue background color for the row
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  drunknessLevel: {
    fontWeight: 'bold',
    marginRight: 10,
    color: '#1565C0', // Dark blue level text color
    alignSelf: 'center',
  },
  drunknessTime: {
    fontStyle: 'italic',
    color: '#1565C0', // Dark blue time text color
    alignSelf: 'center',
  },
  noDataText: {
    fontSize: 16,
    fontStyle: 'italic',
    color: '#1565C0', // Dark blue no data text color
    alignSelf: 'center',
  },
  drunknessLabel: {
    fontWeight: 'bold',
    marginRight: 10,
    color: '#1565C0', // Dark blue level text color
    alignSelf: 'center',
  },
  drunknessItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
    backgroundColor: '#B3E5FC', // Light blue background color for the row
    padding: 10,
    borderRadius: 5,
  },
  drunknessLevelsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    paddingHorizontal: 20,
  },
  column: {
    flex: 1,
    marginLeft: 10,
    marginRight: 10,
  },
  columnHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#1565C0',
    alignSelf: 'center',
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

export const DrunkScreenStyles = StyleSheet.create({
  fullScreen: {
    flex: 1,
    backgroundColor: '#F0F5F9', // Light grey background
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  chartContainer: {
    marginVertical: 20,
    backgroundColor: '#FFFFFF', // White background for charts
    borderRadius: 10,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  toggleButton: {
    backgroundColor: '#007AFF', // Blue button background
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  toggleButtonText: {
    color: '#FFFFFF', // White button text color
    fontSize: 16,
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#81D4FA', // A stylish light blue shade
    padding: 12,
    marginVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3, // For Android shadow effect
  },
  buttonText: {
    color: '#0277BD', // A darker blue for text to ensure good readability
    fontSize: 18,
    fontWeight: 'bold',
  },
  chartContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: '#E7F2F8', // A lighter shade for the inner container for subtle contrast
  },
});


