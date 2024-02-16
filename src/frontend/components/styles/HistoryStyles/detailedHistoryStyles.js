import { StyleSheet } from 'react-native';

export const DetailedHistoryStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
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
    backgroundColor: 'white',
    padding: 16,
    marginBottom: 10,
    borderRadius: 8,
    elevation: 2,
  },
  entryText: {
    fontSize: 16,
    marginBottom: 5,
  },
});

export default DetailedHistoryStyles;
