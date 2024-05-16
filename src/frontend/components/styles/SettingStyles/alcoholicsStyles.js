import { StyleSheet } from 'react-native';

export const AlcoholicsStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E0F2F1', // Light blue background color
    padding: 20,
  },
  title: {
    color: 'navy',
    fontSize: 28,
    fontFamily: 'my_coffee_break',
    textAlign: 'center',
    marginTop: 40,
    marginBottom: 50,
  },
  button: {
    padding: 10,
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#CCCCCC',
  },
  buttonText: {
    fontSize: 24,
    color: '#333333', // Dark gray text color
    fontFamily: 'heyam',
  },
});
