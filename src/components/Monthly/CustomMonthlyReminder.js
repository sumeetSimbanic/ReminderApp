import React, { useState, useEffect } from 'react';
import { View, Text, Button, FlatList } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

export default function CustomMonthlyReminder() {
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isTimePickerVisible, setTimePickerVisibility] = useState(false);
  const [selectedDate, setSelectedDate] = useState([]);
  const [selectedTime, setSelectedTime] = useState(null);
  const [reminders, setReminders] = useState([]);
  const [selectedMonths, setSelectedMonths] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());

  useEffect(() => {
    // Check if a reminder's month matches the current month and trigger it
    const currentMonthName = new Date().toLocaleString('default', { month: 'long' });
    const currentMonthReminders = reminders.filter((reminder) =>
      reminder.months.includes(currentMonthName)
    );

    if (currentMonthReminders.length > 0) {
      currentMonthReminders.forEach((reminder) => {
        // Compare the current date with the reminder date and time
        const currentDate = new Date();
        const reminderDate = new Date(reminder.dates[0]); // Assuming only one date per reminder
        const reminderTime = new Date(reminder.time);

        if (
          currentDate.getMonth() === reminderDate.getMonth() &&
          currentDate.getDate() === reminderDate.getDate() &&
          currentDate.getHours() === reminderTime.getHours() &&
          currentDate.getMinutes() === reminderTime.getMinutes()
        ) {
          alert(`Reminder: ${reminder.months.join(', ')} ${reminder.dates[0]}, ${reminder.time}`);
        }
      });
    }
  }, [reminders, currentMonth]);

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleDateConfirm = (date) => {
    setSelectedDate([...selectedDate, date]);
    hideDatePicker();
  };

  const showTimePicker = () => {
    setTimePickerVisibility(true);
  };

  const hideTimePicker = () => {
    setTimePickerVisibility(false);
  };

  const handleTimeConfirm = (time) => {
    setSelectedTime(time);
    hideTimePicker();
  };

  const addReminder = () => {
    if (selectedDate.length > 0 && selectedTime) {
      const newReminder = {
        id: Date.now().toString(),
        dates: selectedDate.map((date) => date.toDateString()),
        time: selectedTime.toTimeString(),
        months: selectedMonths,
      };
      setReminders([...reminders, newReminder]);
      setSelectedDate([]);
      setSelectedTime(null);
      setSelectedMonths([]);
    }
  };

  const toggleMonthSelection = (month) => {
    if (selectedMonths.includes(month)) {
      setSelectedMonths(selectedMonths.filter((m) => m !== month));
    } else {
      setSelectedMonths([...selectedMonths, month]);
    }
  };

  return (
    <View>
      <Button title="Pick a Date" onPress={showDatePicker} />
<Button title="Pick a Time" onPress={showTimePicker} />

      <Button title="Add Reminder" onPress={addReminder} />

      {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map((month) => (
        <Button
          key={month}
          title={month}
          onPress={() => toggleMonthSelection(month)}
          color={selectedMonths.includes(month) ? 'green' : 'gray'}
        />
      ))}

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
            <Text>Months: {item.months.join(', ')}</Text>
            <Text>Dates: {item.dates.join(', ')}</Text>
            <Text>Time: {item.time}</Text>
          </View>
        )}
      />
    </View>
  );
}
