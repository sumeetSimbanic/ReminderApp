import React, { useState } from 'react';
import { View, Text, Button, ToastAndroid, FlatList } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import * as Notifications from 'expo-notifications';

export default function MultipleTimeReminder() {
  const [startDateTime, setStartDateTime] = useState(null);
  const [endDateTime, setEndDateTime] = useState(null);
  const [selectedTimes, setSelectedTimes] = useState([]);
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [reminders, setReminders] = useState([]);

  const showDateTimePicker = (type) => {
    if (type === 'start') {
      setShowStartPicker(true);
    } else if (type === 'end') {
      setShowEndPicker(true);
    } else if (type === 'time') {
      setShowTimePicker(true);
    }
  };

  const hideDateTimePicker = () => {
    setShowStartPicker(false);
    setShowEndPicker(false);
    setShowTimePicker(false);
  };

  const handleDateTimePickerConfirm = (selectedDateTime, type) => {
    hideDateTimePicker();

    if (selectedDateTime) {
      if (type === 'start') {
        // Clear the time part of the start date-time
        selectedDateTime.setHours(0, 0, 0, 0);
        setStartDateTime(selectedDateTime);
      } else if (type === 'end') {
        // Clear the time part of the end date-time
        selectedDateTime.setHours(0, 0, 0, 0);
        setEndDateTime(selectedDateTime);
      } else if (type === 'time') {
        setSelectedTimes([...selectedTimes, selectedDateTime]);
      }
    }
  };

  const setMultipleTimeReminders = async () => {
    if (!startDateTime || !endDateTime || selectedTimes.length === 0) {
      ToastAndroid.show('Please select start date and time, end date and time, and at least one reminder time', ToastAndroid.SHORT);
      return;
    }

    if (endDateTime <= startDateTime) {
      ToastAndroid.show('End date and time must be after start date and time', ToastAndroid.SHORT);
      return;
    }

    // Calculate the number of days in the selected date range
    const oneDayMilliseconds = 24 * 60 * 60 * 1000;
    const numberOfDays = Math.ceil((endDateTime - startDateTime) / oneDayMilliseconds);

    // Set notifications for each selected time on each day within the selected date interval
    const newReminders = [];

    for (let i = 0; i <= numberOfDays; i++) {
      const reminderDate = new Date(startDateTime.getTime() + i * oneDayMilliseconds);

      for (const selectedTime of selectedTimes) {
        const reminderDateTime = new Date(
          reminderDate.getFullYear(),
          reminderDate.getMonth(),
          reminderDate.getDate(),
          selectedTime.getHours(),
          selectedTime.getMinutes()
        );

        // Set a notification for the reminder time on each day
        await Notifications.scheduleNotificationAsync({
          content: {
            title: 'Daily Reminder',
            body: 'It\'s time for your task!',
          },
          trigger: {
            date: reminderDateTime,
          },
        });

        // Add the reminder details to the array
        newReminders.push({
          id: `${i}-${selectedTime.getHours()}-${selectedTime.getMinutes()}`,
          time: reminderDateTime.toLocaleString(),
        });
      }
    }

    setReminders(newReminders);
    ToastAndroid.show('Daily reminders set successfully', ToastAndroid.SHORT);
  };

  const removeSelectedTime = (id) => {
    const updatedTimes = selectedTimes.filter((time) => time.id !== id);
    setSelectedTimes(updatedTimes);
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={{ marginTop: 20, alignItems: 'center' }}>
        <Text>Set Multiple Time Reminders</Text>
        <Button title="Select Start Date" onPress={() => showDateTimePicker('start')} />
        <Text>Start Date: {startDateTime && startDateTime.toLocaleDateString()}</Text>
        <Button title="Select End Date" onPress={() => showDateTimePicker('end')} />
        <Text>End Date: {endDateTime && endDateTime.toLocaleDateString()}</Text>
        <Button title="Select Reminder Time" onPress={() => showDateTimePicker('time')} />
        <Text>Reminder Times:</Text>
        {selectedTimes.map((time, index) => (
          <View key={index} style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text>{time.toLocaleTimeString()}</Text>
            <Button title="Remove" onPress={() => removeSelectedTime(time.id)} />
          </View>
        ))}
        <Button title="Set Multiple Time Reminders" onPress={setMultipleTimeReminders} />
        <FlatList
        data={reminders}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={{ marginTop: 10 }}>
            <Text>{item.time}</Text>
          </View>
        )}
      />
      </View>

     

      <DateTimePickerModal
        isVisible={showStartPicker}
        mode="date"
        onConfirm={(selectedDateTime) => handleDateTimePickerConfirm(selectedDateTime, 'start')}
        onCancel={hideDateTimePicker}
      />

      <DateTimePickerModal
        isVisible={showEndPicker}
        mode="date"
        onConfirm={(selectedDateTime) => handleDateTimePickerConfirm(selectedDateTime, 'end')}
        onCancel={hideDateTimePicker}
      />

      <DateTimePickerModal
        isVisible={showTimePicker}
        mode="time"
        onConfirm={(selectedDateTime) => handleDateTimePickerConfirm(selectedDateTime, 'time')}
        onCancel={hideDateTimePicker}
      />
    </View>
  );
}
