export const handleDateChange = (event, selectedDate, setDatePickerVisible, setSelectedDate) => {
    setDatePickerVisible(false); // Hide the date picker

    const currentDate = selectedDate || new Date(); // Use selected date or current date
    if (currentDate > new Date()) {
      // If the selected date is in the future, show an alert and do not update the date
      Alert.alert("Invalid Date", "Future dates are not allowed.");
      return;
    }
    setSelectedDate(currentDate); // Update the selected date
  };