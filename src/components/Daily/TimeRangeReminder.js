import React, { useState } from 'react';
import { View, Text, Button, ToastAndroid, TextInput, FlatList } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

export default function TimeRangeReminder() {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [intervalMinutes, setIntervalMinutes] = useState('');
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);
  const [reminders, setReminders] = useState([]);
  

  const showDatePicker = (type) => {
    if (type === 'start-date') {
      setShowStartDatePicker(true);
    } else if (type === 'end-date') {
      setShowEndDatePicker(true);
    }
  };

  const showTimePicker = (type) => {
    if (type === 'start-time') {
      setShowStartTimePicker(true);
    } else if (type === 'end-time') {
      setShowEndTimePicker(true);
    }
  };

  const hideDatePicker = (type) => {
    if (type === 'start-date') {
      setShowStartDatePicker(false);
    } else if (type === 'end-date') {
      setShowEndDatePicker(false);
    }
  };

  const hideTimePicker = (type) => {
    if (type === 'start-time') {
      setShowStartTimePicker(false);
    } else if (type === 'end-time') {
      setShowEndTimePicker(false);
    }
  };

  const handleDateConfirm = (selectedDate, type) => {
    hideDatePicker(type);

    if (selectedDate) {
      if (type === 'start-date') {
        setStartDate(selectedDate);
      } else if (type === 'end-date') {
        setEndDate(selectedDate);
      }
    }
  };

  const handleTimeConfirm = (selectedTime, type) => {
    hideTimePicker(type);

    if (selectedTime) {
      if (type === 'start-time') {
        setStartTime(selectedTime);
      } else if (type === 'end-time') {
        setEndTime(selectedTime);
      }
    }
  };
  const setReminder = () => {
    if (!startDate || !endDate || !startTime || !endTime || !intervalMinutes) {
      ToastAndroid.show('Please select start and end date, start and end time, and enter interval in minutes', ToastAndroid.SHORT);
      return;
    }
  
    const newReminders = [];
    const currentDate = new Date(startDate);
    const endDateTime = new Date(endDate);
    endDateTime.setHours(endTime.getHours());
    endDateTime.setMinutes(endTime.getMinutes());
  
    const interval = parseInt(intervalMinutes, 10);
  
    if (interval <= 0) {
      ToastAndroid.show('Interval should be a positive number', ToastAndroid.SHORT);
      return;
    }
  
    while (currentDate <= endDateTime) {
      const reminderDateTime = new Date(currentDate);
      reminderDateTime.setHours(startTime.getHours());
      reminderDateTime.setMinutes(startTime.getMinutes());
  
      const endReminderDateTime = new Date(currentDate);
      endReminderDateTime.setHours(endTime.getHours());
      endReminderDateTime.setMinutes(endTime.getMinutes());
  
      const now = new Date();
      const timeUntilReminder = reminderDateTime - now; 
  
      const possibleTimes = [];
      let currentPossibleTime = new Date(reminderDateTime);
  
      while (currentPossibleTime <= endReminderDateTime) {
        possibleTimes.push(currentPossibleTime.toLocaleString());
        currentPossibleTime.setMinutes(currentPossibleTime.getMinutes() + interval);
      }
  
      newReminders.push({
        id: reminderDateTime.toString(),
        date: reminderDateTime,
        startTime: reminderDateTime.toLocaleTimeString(),
        endTime: endReminderDateTime.toLocaleTimeString(),
        interval,
        timeUntilReminder,
        possibleTimes,
      });
  
      // Increment the currentDate by one day
      currentDate.setDate(currentDate.getDate() + 1);
    }
  
    setReminders(newReminders);
  
    ToastAndroid.show('Reminders set successfully', ToastAndroid.SHORT);
  
    // Log the date and possible times for each reminder
    newReminders.forEach((reminder) => {
      console.log(`Reminder onoooo ${reminder.date.toDateString()} at ${reminder.startTime} will trigger in ${reminder.timeUntilReminder / (1000 * 60)} minutes.`);
      console.log(`Possible times between start and end time:`);
      reminder.possibleTimes.forEach((time) => {
        console.log(time);
      });
    });
  };
  
  // const setReminder = () => {
  //   if (!startDate || !endDate || !startTime || !endTime || !intervalMinutes) {
  //     ToastAndroid.show('Please select start and end date, start and end time, and enter interval in minutes', ToastAndroid.SHORT);
  //     return;
  //   }
  
  //   const newReminders = [];
  //   const currentDate = new Date(startDate);
  //   const endDateTime = new Date(endDate);
  //   endDateTime.setHours(endTime.getHours());
  //   endDateTime.setMinutes(endTime.getMinutes());
  
  //   const interval = parseInt(intervalMinutes, 10);
  
  //   if (interval <= 0) {
  //     ToastAndroid.show('Interval should be a positive number', ToastAndroid.SHORT);
  //     return;
  //   }
  
  //   while (currentDate <= endDateTime) {
  //     const reminderDateTime = new Date(currentDate);
  //     reminderDateTime.setHours(startTime.getHours());
  //     reminderDateTime.setMinutes(startTime.getMinutes());
  
  //     const endReminderDateTime = new Date(currentDate);
  //     endReminderDateTime.setHours(endTime.getHours());
  //     endReminderDateTime.setMinutes(endTime.getMinutes());
  
  //     newReminders.push({
  //       id: reminderDateTime.toString(),
  //       date: reminderDateTime,
  //       startTime: reminderDateTime.toLocaleTimeString(),
  //       endTime: endReminderDateTime.toLocaleTimeString(),
  //       interval,
  //     });
  
  //     // Increment the currentDate by one day
  //     currentDate.setDate(currentDate.getDate() + 1);
  //   }
  
  //   setReminders(newReminders);
  
  //   ToastAndroid.show('Reminders set successfully', ToastAndroid.SHORT);
  // };
  
  const clearReminders = () => {
    setReminders([]);
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Set Reminder</Text>
      <Button title="Select Start Date" onPress={() => showDatePicker('start-date')} />
      <Text>Start Date: {startDate && startDate.toDateString()}</Text>
      <Button title="Select End Date" onPress={() => showDatePicker('end-date')} />
      <Text>End Date: {endDate && endDate.toDateString()}</Text>
      <Button title="Select Start Time" onPress={() => showTimePicker('start-time')} />
      <Text>Start Time: {startTime && startTime.toTimeString()}</Text>
      <Button title="Select End Time" onPress={() => showTimePicker('end-time')} />
      <Text>End Time: {endTime && endTime.toTimeString()}</Text>
      <TextInput
        placeholder="Enter Interval in Minutes"
        keyboardType="numeric"
        value={intervalMinutes}
        onChangeText={(text) => setIntervalMinutes(text)}
        style={{ marginTop: 10, paddingHorizontal: 10, height: 40, width: 200, borderColor: 'gray', borderWidth: 1 }}
      />
      <Button title="Set Reminders" onPress={setReminder} />

      <FlatList
  data={reminders}
  keyExtractor={(item) => item.id}
  renderItem={({ item }) => (
    <View style={{ marginTop: 10 }}>
      <Text>{`Date: ${item.date}`}</Text>
      <Text>{`Start Time: ${item.startTime}`}</Text>
      <Text>{`End Time: ${item.endTime}`}</Text>
      <Text>{`Interval (in minutes): ${item.interval}`}</Text>
    </View>
  )}
/>

      <Button title="Clear Reminders" onPress={clearReminders} />

      <DateTimePickerModal
        isVisible={showStartDatePicker}
        mode="date"
        onConfirm={(selectedDate) => handleDateConfirm(selectedDate, 'start-date')}
        onCancel={() => hideDatePicker('start-date')}
      />

      <DateTimePickerModal
        isVisible={showEndDatePicker}
        mode="date"
        onConfirm={(selectedDate) => handleDateConfirm(selectedDate, 'end-date')}
        onCancel={() => hideDatePicker('end-date')}
      />

      <DateTimePickerModal
        isVisible={showStartTimePicker}
        mode="time"
        onConfirm={(selectedTime) => handleTimeConfirm(selectedTime, 'start-time')}
        onCancel={() => hideTimePicker('start-time')}
      />

      <DateTimePickerModal
        isVisible={showEndTimePicker}
        mode="time"
        onConfirm={(selectedTime) => handleTimeConfirm(selectedTime, 'end-time')}
        onCancel={() => hideTimePicker('end-time')}
      />
    </View>
  );
}
