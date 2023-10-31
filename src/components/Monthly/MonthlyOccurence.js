import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

const MonthlyOccurence = () => {
  const [selectedDayOfWeek, setSelectedDayOfWeek] = useState('Sunday');
  const [selectedOccurrence, setSelectedOccurrence] = useState('First');
  const [selectedTime, setSelectedTime] = useState('');
  const [reminderList, setReminderList] = useState([]);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const dayOfWeekOptions = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const occurrenceOptions = ['First', 'Second', 'Third', 'Fourth', 'Last']; 

  const handleSetReminder = () => {
    const currentDate = new Date();
    const reminderMonths = [];

    for (let i = 0; i < 3; i++) {
      const currentMonth = currentDate.getMonth() + i;
      const currentYear = currentDate.getFullYear();
      const reminderDate = new Date(currentYear, currentMonth, 1);

      while (reminderDate.getDay() !== dayOfWeekOptions.indexOf(selectedDayOfWeek)) {
        reminderDate.setDate(reminderDate.getDate() + 1);
      }

      if (selectedOccurrence === 'Last') {
        let lastOccurrenceDate = new Date(currentYear, currentMonth + 1, 0);
        while (lastOccurrenceDate.getDay() !== dayOfWeekOptions.indexOf(selectedDayOfWeek)) {
          lastOccurrenceDate.setDate(lastOccurrenceDate.getDate() - 1);
        }
        reminderDate.setTime(lastOccurrenceDate.getTime());
      } else {
        let selectedOccurrenceIndex = occurrenceOptions.indexOf(selectedOccurrence);
        if (selectedOccurrenceIndex >= 0) {
          reminderDate.setDate(reminderDate.getDate() + 7 * selectedOccurrenceIndex);
        }
      }

      const formattedDate = reminderDate.toLocaleDateString();
      const formattedTime = selectedTime ? selectedTime : '00:00:00'; // Default to midnight if no time is selected
      const currentTime = new Date().toLocaleTimeString();
      const reminderWithTime = `${formattedDate} ${formattedTime}`;
      reminderMonths.push(reminderWithTime);
    }

    setReminderList(reminderMonths);
  };

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleDateConfirm = (date) => {
    setSelectedTime(date.toLocaleTimeString());
    hideDatePicker();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create a Reminder</Text>

      <View style={styles.pickerContainer}>
        <Text>Select Day of the Week:</Text>
        <View style={styles.picker}>
          {dayOfWeekOptions.map((day, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => setSelectedDayOfWeek(day)}
              style={[styles.pickerItem, selectedDayOfWeek === day && styles.selectedPickerItem]}
            >
              <Text style={{ fontSize: 8, margin: 1 }}>{day}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.pickerContainer}>
        <Text>Select Occurrence:</Text>
        <View style={styles.picker}>
          {occurrenceOptions.map((occurrence, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => setSelectedOccurrence(occurrence)}
              style={[styles.pickerItem, selectedOccurrence === occurrence && styles.selectedPickerItem]}
            >
              <Text>{occurrence}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <TouchableOpacity onPress={showDatePicker} style={styles.setReminderButton}>
        <Text>Select Time</Text>
      </TouchableOpacity>

      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="time"
        onConfirm={handleDateConfirm}
        onCancel={hideDatePicker}
      />

      <TouchableOpacity onPress={handleSetReminder} style={styles.setReminderButton}>
        <Text>Set Reminder for Next 3 Months</Text>
      </TouchableOpacity>

      <Text>Reminder List for the Next 3 Months:</Text>
      {reminderList.map((reminder, index) => (
        <Text key={index}>{reminder}</Text>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  pickerContainer: {
    marginBottom: 20,
  },
  picker: {
    flexDirection: 'row',
  },
  pickerItem: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    marginRight: 10,
  },
  selectedPickerItem: {
    backgroundColor: 'lightblue',
  },
  setReminderButton: {
    backgroundColor: 'lightgreen',
    padding: 10,
    borderRadius: 5,
  },
});

export default MonthlyOccurence;
