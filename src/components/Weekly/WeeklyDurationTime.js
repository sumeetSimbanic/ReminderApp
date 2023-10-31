import React, { useState } from 'react';
import { View, Text, Button, TouchableOpacity, ScrollView, FlatList } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { scheduleNotificationAsync, cancelScheduledNotificationAsync } from 'expo-notifications';
import WeeklyDuration from './Weeklyduration';

const WeeklyDurationTime = () => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [selectedDays, setSelectedDays] = useState([]);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [timeInterval, setTimeInterval] = useState(1); 
  const [isStartDatePickerVisible, setStartDatePickerVisibility] = useState(false);
  const [isEndDatePickerVisible, setEndDatePickerVisibility] = useState(false);
  const [isStartTimePickerVisible, setStartTimePickerVisibility] = useState(false);
  const [isEndTimePickerVisible, setEndTimePickerVisibility] = useState(false);
  const [selectedReminders, setSelectedReminders] = useState([]);

  const calculateNextOccurrences = (selectedDays, startTime, endTime, startDate, endDate, timeInterval) => {
    const now = new Date();
    const selectedDayIndices = selectedDays.map(day => ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].indexOf(day));
    const occurrences = [];

    selectedDayIndices.forEach(dayIndex => {
      let nextOccurrence = new Date(startDate);
      nextOccurrence.setDate(startDate.getDate() + ((dayIndex + 7 - now.getDay()) % 7));
      nextOccurrence.setHours(startTime.getHours(), startTime.getMinutes());

      // Calculate occurrences based on the specified time interval
      while (nextOccurrence <= endDate) {
        occurrences.push(nextOccurrence.toDateString());
        nextOccurrence.setHours(nextOccurrence.getHours() + timeInterval);
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

  const showStartTimePicker = () => {
    setStartTimePickerVisibility(true);
  };

  const hideStartTimePicker = () => {
    setStartTimePickerVisibility(false);
  };

  const handleStartTimeConfirm = (time) => {
    setStartTime(time);
    hideStartTimePicker();
  };

  const showEndTimePicker = () => {
    setEndTimePickerVisibility(true);
  };

  const hideEndTimePicker = () => {
    setEndTimePickerVisibility(false);
  };

  const handleEndTimeConfirm = (time) => {
    setEndTime(time);
    hideEndTimePicker();
  };

  const handleTimeIntervalChange = (value) => {
    setTimeInterval(value);
  };

  const handleSaveReminder = async () => {
    selectedDays.forEach(async (day) => {
      const dayIndex = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].indexOf(day);
      if (dayIndex !== -1 && startTime && endTime) {
        const now = new Date();
        const occurrences = calculateNextOccurrences(selectedDays, startTime, endTime, startDate, endDate, timeInterval);
  
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
                startTime,
                endTime,
                timeInterval,
                nextOccurrence,
                notificationId, // Store the notification ID for later use
              },
            ]);
  
            // Increment nextOccurrenceDate by the time interval
            nextOccurrenceDate.setHours(nextOccurrenceDate.getHours() + timeInterval);
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
    setStartTime(null);
    setEndTime(null);
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

      <Text style={{ marginTop: 10 }}>Choose Start Time:</Text>
      <TouchableOpacity onPress={showStartTimePicker}>
        <Text>{startTime ? startTime.toTimeString() : 'Select Start Time'}</Text>
      </TouchableOpacity>
      <DateTimePickerModal
        isVisible={isStartTimePickerVisible}
        mode="time"
        onConfirm={handleStartTimeConfirm}
        onCancel={hideStartTimePicker}
      />

      <Text style={{ marginTop: 10 }}>Choose End Time:</Text>
      <TouchableOpacity onPress={showEndTimePicker}>
        <Text>{endTime ? endTime.toTimeString() : 'Select End Time'}</Text>
      </TouchableOpacity>
      <DateTimePickerModal
        isVisible={isEndTimePickerVisible}
        mode="time"
        onConfirm={handleEndTimeConfirm}
        onCancel={hideEndTimePicker}
      />

      <Text style={{ marginTop: 10 }}>Choose Time Interval (Hours):</Text>
      <Picker
        selectedValue={timeInterval}
        onValueChange={(value) => handleTimeIntervalChange(value)}
        style={{ width: 100 }}
      >
        <Picker.Item label="1" value={1} />
        <Picker.Item label="2" value={2} />
        <Picker.Item label="3" value={3} />
        {/* Add more time interval options as needed */}
      </Picker>

      <Button title="Save Reminder" onPress={handleSaveReminder} />

      <Text style={{ marginTop: 20, fontSize: 18, fontWeight: 'bold' }}>Selected Reminders:</Text>
      <FlatList
  data={selectedReminders.slice(0, 5)} // Display only the first five reminders
  keyExtractor={(item, index) => index.toString()}
  renderItem={({ item, index }) => (
    <View style={{ marginVertical: 10 }}>
      {/* Display reminder details */}
      <Text>Next Occurrences: {item.nextOccurrence}</Text>
      <Text>Start Date: {item.startDate ? item.startDate.toDateString() : 'N/A'}</Text>
      <Text>End Date: {item.endDate ? item.endDate.toDateString() : 'N/A'}</Text>
      <Text>Selected Days: {item.selectedDays.join(', ') || 'N/A'}</Text>
      <Text>Start Time: {item.startTime ? item.startTime.toTimeString() : 'N/A'}</Text>
      <Text>End Time: {item.endTime ? item.endTime.toTimeString() : 'N/A'}</Text>
      <Text>Time Interval (Hours): {item.timeInterval}</Text>

      {/* Cancel Notification Button */}
      <Button
        title="Cancel Notification"
        onPress={async () => {
          if (item.notificationId) {
            await cancelScheduledNotificationAsync(item.notificationId.toString());
            console.log(`Canceled notification with ID: ${item.notificationId}`);
          }
        }}
      />
    </View>
  )}
/>

    </View>
  );
};

export default WeeklyDurationTime;
