import { StyleSheet, Dimensions } from 'react-native';

export const bacChartStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'space-around', // Evenly space out the elements vertically
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  button: {
    padding: 10,
    marginVertical: 10,
    width: Dimensions.get('window').width * 0.8, // 80% of screen width
    backgroundColor: '#007bff', // Bootstrap primary button color
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3, // Shadow for Android
    shadowColor: '#000', // Shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  sliderContainer: {
    width: Dimensions.get('window').width * 0.9, // 90% of screen width
    alignItems: 'stretch',
    justifyContent: 'center',
    marginVertical: 20,
  },
  slider: {
    height: 40, // Adjust the height of the slider
    borderRadius: 10,
  },
  chartContainer: {
    borderRadius: 16,
    elevation: 5, // Shadow for Android
    shadowColor: '#000', // Shadow for iOS
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  dateTimePicker: {
    width: '100%',
    backgroundColor: '#ffffff',
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 15,
    elevation: 3, // Shadow for Android
    shadowColor: '#000', // Shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  text: {
    fontSize: 14,
    color: '#333333',
    marginTop: 5,
  },
});