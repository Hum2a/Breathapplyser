import { StyleSheet } from 'react-native';

export const HistoryStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 20,
    alignSelf: 'center',
  },
  historyItem: {
    backgroundColor: '#f2f2f2',
    borderRadius: 8,
    padding: 20,
    margin: 10,
    alignItems: 'center',
  },
  dateText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  entriesCountText: {
    fontSize: 16,
    color: '#666',
  },
});

export default HistoryStyles;
