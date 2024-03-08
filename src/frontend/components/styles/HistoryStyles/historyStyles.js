import { StyleSheet } from 'react-native';

export const HistoryStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#BAEAFF',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    alignSelf: 'center',
  },
  calendarTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    alignSelf: 'center',
    marginVertical: 10,
  },
  calendar: {
    marginTop: 0,
    borderColor: 'lightgrey',
    borderWidth: 1,
  },
  historyItem: {
    backgroundColor: '#92DDFE',
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
