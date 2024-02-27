import { StyleSheet } from "react-native";

export const chartStyles = StyleSheet.create({
    fullScreen: {
      flex: 1,
      backgroundColor: '#BAEAFF', // Set your desired background color here
  },
    chartContainer: {
      marginTop: 20,
      marginBottom: 20,
      backgroundColor: '#9CEEF1',
    },
    legendContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 10,
    },
    legendItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginRight: 10,
    },
    legendColorBox: {
      width: 10,
      height: 10,
      marginRight: 5,
    },
    legendLabel: {
      fontSize: 12,
    },
    intervalButtonsContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginTop: 10,
    },
    intervalButton: {
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 4,
      marginRight: 5,
    },
    intervalButtonActive: {
      backgroundColor: '#ccc',
    },
    xAxisLabelsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-evenly',
      alignItems: 'center',
      marginTop: 5,
    },
    xAxisLabel: {
      transform: [{ rotate: '-45deg' }], // Rotate labels
      textAlign: 'right', // Adjust alignment as needed
      // other styling as needed
    },
  })
  
export const toggleButtonStyles = StyleSheet.create({
  button: {
    backgroundColor: '#4CAF50', // Default background color
    padding: 10,
    borderRadius: 5,
    margin: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  buttonPressed: {
    backgroundColor: '#388E3C', // Darker shade when pressed
  },
});

export const comparisonChartStyles = StyleSheet.create({
  pickersContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#f5f5f5', // You can change this color as per your design
  },
  pickerStyle: {
    height: 50,
    width: 150,
    color: '#000', // Picker text color
  },
  chartContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  legendItem: {
    height: 10,
    width: 10,
    borderRadius: 5,
    marginRight: 5,
  },
  legendLabel: {
    fontSize: 12,
    marginRight: 15,
  }
});
