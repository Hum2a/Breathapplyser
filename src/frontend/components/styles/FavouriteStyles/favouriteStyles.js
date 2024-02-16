import { StyleSheet } from 'react-native';

export const favouriteStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
    padding: 10,
    marginBottom: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  infoContainer: {
    marginBottom: 5,
  },
  categoryText: {
    fontWeight: 'bold',
    fontStyle: 'italic',
    fontSize: 18,
    color: 'black',
  },
  detailsText: {
    fontSize: 16,
    marginBottom: 5,
  },
  deleteButton: {
    backgroundColor: 'red',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    alignSelf: 'flex-end',
  },
  deleteButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  entry: {
    marginBottom: 20,
  },
});
