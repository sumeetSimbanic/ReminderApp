import React, { useState } from 'react';
import { View, Button, Text, FlatList, TextInput, TouchableOpacity } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

export default function MonthlyReminder() {
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedDayOfMonth, setSelectedDayOfMonth] = useState(1); // Default to 1st day of the month
  const [reminders, setReminders] = useState([]);
  const [repeatMonths, setRepeatMonths] = useState(1); // Default to 1 month

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirmDate = (date) => {
    setSelectedDate(date);
    hideDatePicker();
    scheduleReminders(date, selectedDayOfMonth);
  };

  const scheduleReminders = (date, dayOfMonth) => {
    const currentDate = new Date();
    const selectedDate = new Date(date);

    if (dayOfMonth < 1 || dayOfMonth > 31) {
      alert('Please select a valid day of the month (1-31)');
      return;
    }

    const newReminders = [];

    const repeatCount = Math.max(0, Math.floor(repeatMonths));

    for (let i = 0; i < repeatCount; i++) {
      const nextReminderYear = currentDate.getFullYear();
      const nextReminderMonth = currentDate.getMonth() + i;

      // Adjust the month and year if necessary
      if (nextReminderMonth >= 12) {
        nextReminderYear += Math.floor(nextReminderMonth / 12);
        nextReminderMonth %= 12;
      }

      const nextReminderDate = new Date(
        nextReminderYear,
        nextReminderMonth,
        dayOfMonth,
        selectedDate.getHours(),
        selectedDate.getMinutes()
      );

      if (nextReminderDate >= currentDate) {
        newReminders.push({
          id: i,
          date: nextReminderDate.toLocaleString(),
        });
      }
    }

    setReminders(newReminders);
  };

  const renderDaySelector = () => {
    return (
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Text>Select Day of the Month:</Text>
        <TouchableOpacity
          style={{
            borderColor: 'gray',
            borderWidth: 1,
            width: 50,
            height: 30,
            justifyContent: 'center',
            alignItems: 'center',
            marginLeft: 10,
          }}
          onPress={showDatePicker}
        >
          <Text>{selectedDayOfMonth}</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Button title="Select Date" onPress={showDatePicker} />
      <Text>
        {selectedDate
          ? `Selected Date: ${selectedDate.toLocaleDateString()}`
          : 'No date selected'}
      </Text>
      {renderDaySelector()}
      <Text>Repeat Reminder Every N Months:</Text>
      <TextInput
        style={{ borderColor: 'gray', borderWidth: 1, width: 50, textAlign: 'center' }}
        keyboardType="numeric"
        onChangeText={(text) => setRepeatMonths(parseInt(text) || 1)}
        value={repeatMonths.toString()}
      />
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirmDate}
        onCancel={hideDatePicker}
      />
      <FlatList
        data={reminders}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Text>Reminder: {item.date}</Text>
        )}
      />
    </View>
  );
}
