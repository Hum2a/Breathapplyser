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
});

