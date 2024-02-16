import React, { useState } from 'react';
import { View, Text } from 'react-native';
import MultiSlider from '@ptomasroos/react-native-multi-slider';

const TimeFrameSlider = ({ initialStartDate, initialEndDate, onTimeFrameChange }) => {
  const [sliderValues, setSliderValues] = useState([initialStartDate.getHours(), initialEndDate.getHours()]);

  const handleSliderChange = (values) => {
    setSliderValues(values);
    // Assuming you want to call a parent component's callback to update the actual start and end times
    onTimeFrameChange(values);
  };

  return (
    <View>
      <Text>Select Time Frame:</Text>
      <MultiSlider
        values={sliderValues}
        sliderLength={280} // Adjust based on your layout
        onValuesChange={handleSliderChange}
        min={0}
        max={24}
        step={1}
        allowOverlap={false} // Set to true if you want to allow the user to select the same value for both thumbs
        snapped // Set to true if you want the slider to snap to steps
      />
      <Text>Start Hour: {sliderValues[0]}, End Hour: {sliderValues[1]}</Text>
    </View>
  );
};

export default TimeFrameSlider;
