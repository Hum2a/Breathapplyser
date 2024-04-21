export const chartConfig = {
    backgroundColor: '#ffffff',
    backgroundGradientFrom: '#BAEAFF',
    backgroundGradientTo: '#E7F2F8',
    decimalPlaces: 0, // consider if you want decimals or not
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`, // Text color
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`, // Label color for consistency
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '6', // Radius of the dot
      strokeWidth: '2',
      stroke: '#007AFF', // Theme consistent blue
    },
    barPercentage: 0.5,
    barRadius: 4, // Rounded bar edges for aesthetics
    fillShadowGradient: '#007AFF', // Gradient color for bars
    fillShadowGradientOpacity: 1, // Gradient opacity
  };