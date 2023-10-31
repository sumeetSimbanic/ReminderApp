import React, { useState, useEffect } from 'react';
import { View, Text, Button, FlatList } from 'react-native';

export default function MultipleTimeMonth() {
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isTimePickerVisible, setTimePickerVisibility] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTimes, setSelectedTimes] = useState([]);
  const [reminders, setReminders] = useState([]);

  // Function to add a reminder
  const addReminder = () => {
    if (selectedDate && selectedTimes.length > 0) {
      const newReminder = {
        id: Date.now().toString(),
        date: selectedDate,
        times: [...selectedTimes],
      };
      setReminders([...reminders, newReminder]);
      setSelectedDate(null);
      setSelectedTimes([]);
    }
  };

  // Function to check and trigger reminders
  useEffect(() => {
    const checkReminders = () => {
      const currentDate = new Date();
      reminders.forEach((reminder) => {
        const reminderDate = new Date(reminder.date);
        reminderDate.setSeconds(0);
        reminderDate.setMilliseconds(0);

        reminder.times.forEach((time) => {
          const reminderTime = new Date(time);
          reminderDate.setHours(reminderTime.getHours());
          reminderDate.setMinutes(reminderTime.getMinutes());

          // Check if it's time to trigger the reminder
          if (
            currentDate.getDate() === reminderDate.getDate() && // Same day of the month
            currentDate.getHours() === reminderDate.getHours() && // Same hour
            currentDate.getMinutes() === reminderDate.getMinutes() // Same minute
          ) {
            alert(`Reminder: ${reminderDate.toDateString()} ${time}`);
          }
        });
      });
    };

    const intervalId = setInterval(checkReminders, 60000); // Check every minute
    return () => clearInterval(intervalId);
  }, [reminders]);

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const showTimePicker = () => {
    setTimePickerVisibility(true);
  };

  const hideTimePicker = () => {
    setTimePickerVisibility(false);
  };

  const handleDateConfirm = (date) => {
    setSelectedDate(date);
    hideDatePicker();
  };

  const handleTimeConfirm = (time) => {
    const formattedTime = time.toTimeString().split(' ')[0]; // Extract HH:mm format
    setSelectedTimes([...selectedTimes, formattedTime]);
    hideTimePicker();
  };

  return (
    <View>
      <Button title="Pick a Date" onPress={showDatePicker} />
      <Button title="Pick a Time" onPress={showTimePicker} />

      {selectedDate && selectedTimes.length > 0 && (
        <View>
          <Text>Selected Date: {selectedDate.toDateString()}</Text>
          <Text>Selected Times: {selectedTimes.join(', ')}</Text>
        </View>
      )}

      <Button title="Add Reminder" onPress={addReminder} />

      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleDateConfirm}
        onCancel={hideDatePicker}
      />

      <DateTimePickerModal
        isVisible={isTimePickerVisible}
        mode="time"
        onConfirm={handleTimeConfirm}
        onCancel={hideTimePicker}
      />

      <FlatList
        data={reminders}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={{ padding: 10 }}>
            <Text>Date: {item.date.toString()}</Text>
            <Text>Times: {item.times.join(', ')}</Text>
          </View>
        )}
      />
    </View>
  );
}
