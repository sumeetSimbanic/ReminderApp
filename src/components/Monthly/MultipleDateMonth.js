import React, { useState } from 'react';
import { View, Text, Button, TextInput, FlatList, StyleSheet } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

export default function MultipleDateMonth() {
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isTimePickerVisible, setTimePickerVisibility] = useState(false);
  const [selectedDates, setSelectedDates] = useState([]); // Store an array of selected dates
  const [selectedTime, setSelectedTime] = useState(null);
  const [reminders, setReminders] = useState([]);

  // Function to add a reminder
  const addReminder = () => {
    if (selectedDates.length > 0 && selectedTime) {
      const reminderData = selectedDates.map((date) => ({
        id: Date.now() + date.getTime(), // Unique ID for each reminder
        date,
        time: selectedTime,
      }));

      setReminders([...reminders, ...reminderData]);
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
    setSelectedDates([...selectedDates, date]); // Add selected date to the array
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

      {selectedDates.length > 0 && selectedTime && (
        <View>
          <Text>Selected Dates:</Text>
          <FlatList
            data={selectedDates}
            keyExtractor={(item) => item.toString()}
            renderItem={({ item }) => <Text>{item.toDateString()}</Text>}
          />
          <Text>Selected Time: {selectedTime.toLocaleTimeString()}</Text>
        </View>
      )}

      <Button title="Set Reminderee" onPress={addReminder} />

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
  reminderItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
});
