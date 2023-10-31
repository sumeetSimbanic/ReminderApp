import React, { useState, useEffect } from 'react';
import { View, Text, Button, TextInput, FlatList, StyleSheet } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

export default function OnceMonthReminder() {
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isTimePickerVisible, setTimePickerVisibility] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [reminders, setReminders] = useState([]);
  const [numberOfMonths, setNumberOfMonths] = useState('3'); // Default value is 3 months

  // Function to add a reminder
  const addReminder = () => {
    if (selectedDate && selectedTime) {
      const currentDate = new Date();
      const nextMonths = parseInt(numberOfMonths, 10); // Parse the input to an integer
      const nextMonthsReminders = [];

      for (let i = 0; i < nextMonths; i++) {
        const nextMonthDate = new Date(currentDate);
        nextMonthDate.setMonth(currentDate.getMonth() + i + 1);

        const reminderDate = new Date(nextMonthDate);
        reminderDate.setDate(selectedDate.getDate());
        reminderDate.setHours(selectedTime.getHours());
        reminderDate.setMinutes(selectedTime.getMinutes());
        reminderDate.setSeconds(0);
        reminderDate.setMilliseconds(0);

        nextMonthsReminders.push({
          id: Date.now() + i,
          date: new Date(reminderDate),
          time: new Date(selectedTime),
        });
      }

      setReminders(nextMonthsReminders);
    }
  };

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
    setSelectedTime(time);
    hideTimePicker();
  };

  return (
    <View style={styles.container}>
      <Button title="Pick a Date" onPress={showDatePicker} />
      <Button title="Pick a Time" onPress={showTimePicker} />

      <Text>Number of Months: </Text>
      <TextInput
        style={styles.input}
        value={numberOfMonths}
        onChangeText={(text) => setNumberOfMonths(text)}
        keyboardType="numeric"
      />

      {selectedDate && selectedTime && (
        <View>
          <Text>Selected Date: {selectedDate.toDateString()}</Text>
          <Text>Selected Time: {selectedTime.toLocaleTimeString()}</Text>
        </View>
      )}

      <Button title="Set Reminder" onPress={addReminder} />

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
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.reminderItem}>
            <Text>Date: {item.date.toDateString()}</Text>
            <Text>Time: {item.time.toLocaleTimeString()}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    paddingHorizontal: 16,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 8,
  },
  reminderItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
});
