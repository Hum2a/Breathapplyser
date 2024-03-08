import { StyleSheet, Dimensions } from 'react-native';

const screenWidth = Dimensions.get('window').width;

export const DetailedHistoryStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#BAEAFF',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 20,
    textAlign: 'center',
  },
  chartContainer: {
    backgroundColor: 'white',
    padding: 16,
    marginBottom: 20,
    borderRadius: 8,
    elevation: 2,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  entryItem: {
    backgroundColor: '#92DDFE',
    padding: 16,
    marginBottom: 10,
    borderRadius: 8,
    elevation: 2,
    width: screenWidth * 0.95,
    left: screenWidth/40,
  },
  entryText: {
    fontSize: 16,
    marginBottom: 5,
  },
});

export default DetailedHistoryStyles;
