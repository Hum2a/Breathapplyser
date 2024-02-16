import React from 'react';
import { Picker } from '@react-native-picker/picker';
import { addStyles } from '../../styles/DrinkingStyles/addStyles';
import DateTimePicker from '@react-native-community/datetimepicker';
import { TimePickerModal } from 'react-native-paper-dates';

export const CurrencyPicker = ({ selectedValue, onValueChange, currencies }) => (
  <Picker
    selectedValue={selectedValue}
    style={addStyles.priceUnitPicker}
    onValueChange={onValueChange}
  >
    {currencies.map((currency) => (
      <Picker.Item key={currency.value} label={currency.label} value={currency.value} />
    ))}
  </Picker>
);

export const CustomDatePicker = ({ isVisible, mode, display, onChange, value, maximumDate }) => {
    return (
      isVisible && (
        <DateTimePicker
          value={value}
          mode={mode}
          display={display}
          onChange={onChange}
          maximumDate={maximumDate}
        />
      )
    );
  };
  
  export const CustomTimePickerModal = ({ visible, onDismiss, onConfirm, label, cancelLabel, confirmLabel }) => {
    return (
      <TimePickerModal
        visible={visible}
        onDismiss={onDismiss}
        onConfirm={onConfirm}
        label={label}
        cancelLabel={cancelLabel}
        confirmLabel={confirmLabel}
      />
    );
  };
  

// Add more picker components as needed
