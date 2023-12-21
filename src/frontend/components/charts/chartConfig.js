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
      },
      withVerticalLabels: true,
    },
    // Additional chart configurations can be added here if needed
  };
  