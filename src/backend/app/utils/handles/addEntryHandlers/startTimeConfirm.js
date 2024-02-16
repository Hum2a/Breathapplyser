import moment from "moment";

export const handleStartTimeConfirm = (time, setSelectedStartTime, hideStartTimePicker, isFutureTime, runShakeAnimation, runColourFlashAnimation, selectedDate) => {
    const formattedTime = moment(time).format('HH:mm');
    const combinedDateTime = moment(`${selectedDate} ${formattedTime}`);
    if (isFutureTime(combinedDateTime)) {
      runShakeAnimation();
      runColourFlashAnimation();
      alert("Future times are not allowed.");
      return;
    }
    setSelectedStartTime(formattedTime);
    hideStartTimePicker();
  };