import React, { useState } from 'react';
import { View, Text, Button, TouchableOpacity, ScrollView, FlatList } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { scheduleNotificationAsync, cancelScheduledNotificationAsync } from 'expo-notifications';

const WeeklyDuration = () => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [selectedDays, setSelectedDays] = useState([]);
  const [selectedTime, setSelectedTime] = useState(null);
  const [duration, setDuration] = useState(1); // Default duration is 1 week
  const [isStartDatePickerVisible, setStartDatePickerVisibility] = useState(false);
  const [isEndDatePickerVisible, setEndDatePickerVisibility] = useState(false);
  const [isTimePickerVisible, setTimePickerVisibility] = useState(false);
  const [selectedReminders, setSelectedReminders] = useState([]);

  const calculateNextOccurrences = (selectedDays, selectedTime, startDate, duration) => {
    const now = new Date();
    const selectedDayIndices = selectedDays.map(day => ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].indexOf(day));
    const occurrences = [];

    selectedDayIndices.forEach(dayIndex => {
      let nextOccurrence = new Date(startDate);
      nextOccurrence.setDate(startDate.getDate() + ((dayIndex + 7 - now.getDay()) % 7));
      nextOccurrence.setHours(selectedTime.getHours(), selectedTime.getMinutes());

      // Calculate occurrences based on the specified duration
      while (nextOccurrence <= endDate) {
        occurrences.push(nextOccurrence.toDateString());
        nextOccurrence.setDate(nextOccurrence.getDate() + (7 * duration));
      }
    });

    return occurrences;
  };

  const showStartDatePicker = () => {
    setStartDatePickerVisibility(true);
  };

  const hideStartDatePicker = () => {
    setStartDatePickerVisibility(false);
  };

  const handleStartDateConfirm = (date) => {
    setStartDate(date);
    hideStartDatePicker();
  };

  const showEndDatePicker = () => {
    setEndDatePickerVisibility(true);
  };

  const hideEndDatePicker = () => {
    setEndDatePickerVisibility(false);
  };

  const handleEndDateConfirm = (date) => {
    setEndDate(date);
    hideEndDatePicker();
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

  const handleDurationChange = (value) => {
    setDuration(value);
  };

  const handleSaveReminder = async () => {
    selectedDays.forEach(async (day) => {
      const dayIndex = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].indexOf(day);
      if (dayIndex !== -1 && selectedTime) {
        const now = new Date();
        const occurrences = calculateNextOccurrences(selectedDays, selectedTime, startDate, duration);

        occurrences.forEach(async (nextOccurrence) => {
          const nextOccurrenceDate = new Date(nextOccurrence);
          if (nextOccurrenceDate > now) {
            const notificationId = await scheduleNotificationAsync({
              content: {
                title: 'Reminder',
                body: 'Time to check your reminder!',
              },
              trigger: {
                date: nextOccurrenceDate,
                repeats: 'week', // Repeat weekly
              },
            });

            console.log(`Scheduled notification with ID: ${notificationId}`);

            // Add the selected reminder to the state
            setSelectedReminders((prevReminders) => [
              ...prevReminders,
              {
                startDate,
                endDate,
                selectedDays,
                selectedTime,
                duration,
                nextOccurrence,
                notificationId, // Store the notification ID for later use
              },
            ]);
          }
        });
      }
    });

    clearSelections();
  };

  const clearSelections = () => {
    setStartDate(null);
    setEndDate(null);
    setSelectedDays([]);
    setSelectedTime(null);
  };

  return (
    <View style={{ flex: 1, marginTop: 20, alignItems: 'center' }}>
      <Text>Choose Start Date:</Text>
      <TouchableOpacity onPress={showStartDatePicker}>
        <Text>{startDate ? startDate.toDateString() : 'Select Start Date'}</Text>
      </TouchableOpacity>
      <DateTimePickerModal
        isVisible={isStartDatePickerVisible}
        mode="date"
        onConfirm={handleStartDateConfirm}
        onCancel={hideStartDatePicker}
      />

      <Text>Choose End Date:</Text>
      <TouchableOpacity onPress={showEndDatePicker}>
        <Text>{endDate ? endDate.toDateString() : 'Select End Date'}</Text>
      </TouchableOpacity>
      <DateTimePickerModal
        isVisible={isEndDatePickerVisible}
        mode="date"
        onConfirm={handleEndDateConfirm}
        onCancel={hideEndDatePicker}
      />

      <Text style={{ marginBottom: 10 }}>Choose Days:</Text>
      <ScrollView horizontal>
        {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
          <TouchableOpacity
            key={day}
            onPress={() => {
              if (selectedDays.includes(day)) {
                setSelectedDays(selectedDays.filter((selectedDay) => selectedDay !== day));
              } else {
                setSelectedDays([...selectedDays, day]);
              }
            }}
            style={{
              backgroundColor: selectedDays.includes(day) ? 'lightblue' : 'white',
              paddingHorizontal: 10,
              paddingVertical: 5,
              marginRight: 10,
              borderRadius: 10,
            }}
          >
            <Text>{day}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Text style={{ marginTop: 10 }}>Choose Time:</Text>
      <TouchableOpacity onPress={showTimePicker}>
        <Text>{selectedTime ? selectedTime.toTimeString() : 'Select Time'}</Text>
      </TouchableOpacity>
      <DateTimePickerModal
        isVisible={isTimePickerVisible}
        mode="time"
        onConfirm={handleTimeConfirm}
        onCancel={hideTimePicker}
      />

      <Text style={{ marginTop: 10 }}>Choose Duration (Weeks):</Text>
      <Picker
        selectedValue={duration}
        onValueChange={(value) => handleDurationChange(value)}
        style={{ width: 100 }}
      >
        <Picker.Item label="1" value={1} />
        <Picker.Item label="2" value={2} />
        <Picker.Item label="3" value={3} />
        {/* Add more duration options as needed */}
      </Picker>

      <Button title="Save Reminder" onPress={handleSaveReminder} />

      <Text style={{ marginTop: 20, fontSize: 18, fontWeight: 'bold' }}>Selected Reminders:</Text>
      <FlatList
        data={selectedReminders}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View style={{ marginVertical: 10 }}>
            {/* Display reminder details */}
            <Text>Next Occurrences: {item.nextOccurrence}</Text>
            <Text>Start Date: {item.startDate ? item.startDate.toDateString() : 'N/A'}</Text>
            <Text>End Date: {item.endDate ? item.endDate.toDateString() : 'N/A'}</Text>
            <Text>Selected Days: {item.selectedDays.join(', ') || 'N/A'}</Text>
            <Text>Selected Time: {item.selectedTime ? item.selectedTime.toTimeString() : 'N/A'}</Text>

            {/* Cancel Notification Button */}
            {/* <Button
              title="Cancel Notification"
              onPress={async () => {
                if (item.notificationId) {
                  await cancelScheduledNotificationAsync(item.notificationId.toString());
                  console.log(`Canceled notification with ID: ${item.notificationId}`);
                }
              }}
            /> */}
          </View>
        )}
      />
    </View>
  );
};

export default WeeklyDuration;
