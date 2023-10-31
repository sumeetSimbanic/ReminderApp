import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

const MonthlyOccurrenceTwo = () => {
  const [selectedDaysOfWeek, setSelectedDaysOfWeek] = useState([]);
  const [selectedOccurrence, setSelectedOccurrence] = useState('First');
  const [startTime, setStartTime] = useState('00:00:00');
  const [endTime, setEndTime] = useState('23:59:59');
  const [reminderList, setReminderList] = useState([]);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [selectedTimeType, setSelectedTimeType] = useState('startTime');
  const [selectedTime, setSelectedTime] = useState('00:00:00');
  
  

  const dayOfWeekOptions = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const occurrenceOptions = ['First', 'Second', 'Third', 'Fourth', 'Last']; 

  const toggleDaySelection = (day) => {
    // Check if the day is already selected, if yes, deselect it; if no, select it.
    const updatedSelection = selectedDaysOfWeek.includes(day)
      ? selectedDaysOfWeek.filter((selectedDay) => selectedDay !== day)
      : [...selectedDaysOfWeek, day];
    setSelectedDaysOfWeek(updatedSelection);
  };

  const showDatePicker = (type) => {
    setDatePickerVisibility(true);
    setSelectedTimeType(type);
  };
  const handleDateConfirm = (date) => {
    setSelectedTime(date.toLocaleTimeString());
    hideDatePicker();
  };
  
  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

 
  const handleSetReminder = () => {
    const currentDate = new Date();
    const reminderMonths = [];
  
    for (let i = 0; i < 3; i++) {
      const currentMonth = currentDate.getMonth() + i;
      const currentYear = currentDate.getFullYear();
  
      selectedDaysOfWeek.forEach((selectedDayOfWeek) => {
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
  
        // Check if the reminder time is within the selected start and end times.
        const reminderTime = new Date(`2000-01-01 ${selectedTimeType === 'startTime' ? startTime : endTime}`);
        const startTimeDate = new Date(`2000-01-01 ${startTime}`);
        const endTimeDate = new Date(`2000-01-01 ${endTime}`);
  
        if (reminderTime >= startTimeDate && reminderTime <= endTimeDate) {
          const formattedDate = reminderDate.toLocaleDateString();
          const formattedTime = selectedTime ? selectedTime : '00:00:00'; // Default to midnight if no time is selected
          const reminderObject = {
            date: formattedDate,
            startTime: selectedTimeType === 'startTime' ? formattedTime : '00:00:00',
            endTime: selectedTimeType === 'endTime' ? formattedTime : '23:59:59',
          };
          reminderMonths.push(reminderObject);
        }
      });
    }
  
    setReminderList(reminderMonths);
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
              onPress={() => toggleDaySelection(day)}
              style={[
                styles.pickerItem,
                selectedDaysOfWeek.includes(day) && styles.selectedPickerItem,
              ]}
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
              style={[
                styles.pickerItem,
                selectedOccurrence === occurrence && styles.selectedPickerItem,
              ]}
            >
              <Text>{occurrence}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <TouchableOpacity onPress={() => showDatePicker('startTime')} style={styles.setReminderButton}>
        <Text>Select Start Time</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => showDatePicker('endTime')} style={styles.setReminderButton}>
        <Text>Select End Time</Text>
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
      <FlatList
  data={reminderList}
  keyExtractor={(item, index) => index.toString()}
  renderItem={({ item, index }) => (
    <View key={index}>
      <Text>Date: {item.date}</Text>
      <Text>Start Time: {item.startTime}</Text>
      <Text>End Time: {item.endTime}</Text>
    </View>
  )}
/>

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

export default MonthlyOccurrenceTwo;
