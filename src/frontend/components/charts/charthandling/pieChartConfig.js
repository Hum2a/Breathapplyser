export const chartConfig = {
    backgroundColor: '#ffffff',
    backgroundGradientFrom: '#BAEAFF',
    backgroundGradientTo: '#E7F2F8',
    decimalPlaces: 0, // optional, defaults to 2dp
    color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`, // function returning a color with opacity
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`, // optional
    style: {
        borderRadius: 16,
    },
    propsForDots: {
        r: '6',
        strokeWidth: '2',
        stroke: '#ffa726',
    },
    };
  