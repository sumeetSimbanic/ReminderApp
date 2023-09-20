import React, { useState } from 'react';
import { View, Text, Button, ToastAndroid, FlatList } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import * as Notifications from 'expo-notifications';

export default function DateRangeReminder() {
  const [startDateTime, setStartDateTime] = useState(null);
  const [endDateTime, setEndDateTime] = useState(null);
  const [reminderTime, setReminderTime] = useState(null);
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [showReminderTimePicker, setShowReminderTimePicker] = useState(false);
  const [reminders, setReminders] = useState([]);

  const showDateTimePicker = (type) => {
    if (type === 'start') {
      setShowStartPicker(true);
    } else if (type === 'end') {
      setShowEndPicker(true);
    } else if (type === 'reminderTime') {
      setShowReminderTimePicker(true);
    }
  };

  const hideDateTimePicker = () => {
    setShowStartPicker(false);
    setShowEndPicker(false);
    setShowReminderTimePicker(false);
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
      } else if (type === 'reminderTime') {
        setReminderTime(selectedDateTime);
      }
    }
  };

  const setDailyReminderInRange = async () => {
    if (!startDateTime || !endDateTime || !reminderTime) {
      ToastAndroid.show('Please select start date and time, end date and time, and reminder time', ToastAndroid.SHORT);
      return;
    }

    if (endDateTime <= startDateTime) {
      ToastAndroid.show('End date and time must be after start date and time', ToastAndroid.SHORT);
      return;
    }

    // Calculate the number of days in the selected date range
    const oneDayMilliseconds = 24 * 60 * 60 * 1000;
    const numberOfDays = Math.ceil((endDateTime - startDateTime) / oneDayMilliseconds);

    // Calculate the time difference between the reminder time and now
    const now = new Date();
    const reminderTimeToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), reminderTime.getHours(), reminderTime.getMinutes());
    const timeDifferenceMilliseconds = reminderTimeToday - now;

    // Set a daily notification for each day within the selected date interval
    for (let i = 0; i <= numberOfDays; i++) {
      const reminderDate = new Date(startDateTime.getTime() + i * oneDayMilliseconds);
      const reminderDateTime = new Date(reminderDate.getFullYear(), reminderDate.getMonth(), reminderDate.getDate(), reminderTime.getHours(), reminderTime.getMinutes());

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
      setReminders((prevReminders) => [
        ...prevReminders,
        {
          id: i.toString(),
          time: reminderDateTime.toLocaleString(),
        },
      ]);
    }

    ToastAndroid.show('Daily reminders set successfully', ToastAndroid.SHORT);
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Set Daily Reminder</Text>
      <Button title="Select Start Date" onPress={() => showDateTimePicker('start')} />
      <Text>Start Date: {startDateTime && startDateTime.toLocaleDateString()}</Text>
      <Button title="Select End Date" onPress={() => showDateTimePicker('end')} />
      <Text>End Date: {endDateTime && endDateTime.toLocaleDateString()}</Text>
      <Button title="Select Reminder Time" onPress={() => showDateTimePicker('reminderTime')} />
      <Text>Reminder Time: {reminderTime && reminderTime.toLocaleTimeString()}</Text>
      <Button title="Set Daily Reminders" onPress={setDailyReminderInRange} />

      <FlatList
        data={reminders}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={{ marginTop: 10 }}>
            <Text>{item.time}</Text>
          </View>
        )}
      />

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
        isVisible={showReminderTimePicker}
        mode="time"
        onConfirm={(selectedDateTime) => handleDateTimePickerConfirm(selectedDateTime, 'reminderTime')}
        onCancel={hideDateTimePicker}
      />
    </View>
  );
}
