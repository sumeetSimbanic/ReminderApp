import React, { useState } from 'react';
import { View, Button, Text, FlatList, TextInput } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

export default function YearlyReminderTwo() {
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [reminders, setReminders] = useState([]);
  const [selectedMonths, setSelectedMonths] = useState([]); 
  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirmDate = (date) => {
    setSelectedDate(date);
    hideDatePicker();
  };

  const toggleMonthSelection = (month) => {
    const updatedSelection = selectedMonths.includes(month)
      ? selectedMonths.filter((selectedMonth) => selectedMonth !== month)
      : [...selectedMonths, month];
    setSelectedMonths(updatedSelection);
  };

  const handleSetReminder = () => {
    if (!selectedDate) {
      // Handle the case where selectedDate is null (not selected)
      return;
    }

    // Schedule reminders here based on selectedDate and selectedMonths
    const newReminders = [];
    selectedMonths.forEach((selectedMonth) => {
      const nextReminderDate = new Date(
        selectedDate.getFullYear(),
        selectedMonth, // Use the selected month
        selectedDate.getDate(),
        selectedDate.getHours(),
        selectedDate.getMinutes()
      );

      // Check if the reminder date is in the future
      if (nextReminderDate >= new Date()) {
        newReminders.push({
          id: nextReminderDate.getTime(), // Unique ID for the reminder
          date: nextReminderDate.toLocaleString(),
        });
      }
    });

    setReminders(newReminders);
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Button title="Select Date and Time" onPress={showDatePicker} />
      <Text>
        {selectedDate
          ? `Selected Date and Time: ${selectedDate.toLocaleString()}`
          : 'No date and time selected'}
      </Text>
      <Text>Select Months for Reminders:</Text>
      <View style={{ flexDirection: 'row' }}>
        {Array.from({ length: 12 }, (_, i) => (
          <Button
            key={i}
            title={(i + 1).toString()}
            onPress={() => toggleMonthSelection(i)}
            color={selectedMonths.includes(i) ? 'blue' : 'gray'}
          />
        ))}
      </View>
      <Button title="Set Reminder" onPress={handleSetReminder} />
      <FlatList
        data={reminders}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Text>Reminder: {item.date}</Text>
        )}
      />
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="datetime"
        onConfirm={handleConfirmDate}
        onCancel={hideDatePicker}
      />
    </View>
  );
}
