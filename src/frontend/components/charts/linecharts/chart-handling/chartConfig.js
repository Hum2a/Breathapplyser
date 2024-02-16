export const chartConfig = {
    chartColors: ['#297AB1', '#FF6A5C', '#FFC154'], // Customize the colors for each chart
  
    // Configuration for the line charts
    lineChartConfig: {
      backgroundColor: '#ffffff',
      backgroundGradientFrom: '#ffffff',
      backgroundGradientTo: '#ffffff',
      decimalPlaces: 2,
      color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
      style: {
        borderRadius: 16,
        marginVertical: 8,
        paddingTop: 20,
        paddingBottom: 30,
      },
      propsForLabels: {
        fontSize: 10,
      },
      withVerticalLabels: true,
    },
    propsForLabels: {
      fill: "#000000",
    },
  };
  