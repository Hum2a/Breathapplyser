import { StyleSheet } from 'react-native';


export const DrunkStyles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent', // Light background color
  },
  graphTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1565C0',
},
  pickersContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
    backgroundColor: 'red',
  },
  pickerStyle: {
    flex: 1,
    height: 50,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    marginRight: 10,
    alignSelf: 'center',
    color: 'black',
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
    marginLeft: 20, // Add marginLeft to create space between legend and drunkness level items
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
    backgroundColor: '#e3f2fd', // Light blue background for items
    padding: 10,
    borderRadius: 5,
    marginBottom: 5,
    width: '100%',
    alignItems: 'center',
},
  drunkennessLevelsContainer: {
    flexDirection: 'row',
    marginTop: 20,
    justifyContent: 'space-around',
    width: '100%',
},
    column: {
        flex: 1,
        alignItems: 'center',
    },
    columnHeader: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#1565C0',
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
  iconContainer: {
    alignItems: 'flex-start',
    top: -13,
    },
  icon: {
    width: 40, // Set a fixed width for your icon
    height: 40, // Set a fixed height for your icon
    resizeMode: 'contain' // Ensure the icon scales properly
}
});


