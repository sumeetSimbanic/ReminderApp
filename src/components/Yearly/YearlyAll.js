import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, FlatList, TouchableOpacity, Modal,Button } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { Picker } from '@react-native-picker/picker';

const YearlyAll = () => {
  const [selectedInterval, setSelectedInterval] = useState('daily');
  const [selectedDuration, setSelectedDuration] = useState('1');
  const [selectedYearlyInterval, setSelectedYearlyInterval] = useState('1');
  const [isSnoozeVisible, setSnoozeVisible] = useState(false);
  const [snoozeTime, setSnoozeTime] = useState(5); // 5 minutes
  const [snoozeInterval, setSnoozeInterval] = useState(60 * 60 * 1000); // 1 hour in milliseconds

  const [selectedMonths, setSelectedMonths] = useState([]);
  const [selectedDate, setSelectedDate] = useState('1');
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [selectedReminders, setSelectedReminders] = useState([]);
  const [isSnoozeActive, setIsSnoozeActive] = useState(false);
  const [dates] = useState(Array.from({ length: 31 }, (_, i) => (i + 1).toString()));
  const [maxIntervalValue] = useState(10);
  const [intervalValues] = useState(Array.from({ length: maxIntervalValue }, (_, i) => (i + 1).toString()));
  const [months] = useState([
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]);
  const [isTimePickerVisible, setTimePickerVisible] = useState(false);
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  const updateCurrentDateTime = () => {
    setCurrentDateTime(new Date());
  };

  const snoozeReminder = () => {
    const currentTime = selectedTime.getTime();
    const snoozeTimeMilliseconds = snoozeTime * 60 * 1000; // Convert snooze time to milliseconds

    if (selectedInterval !== 'daily' && selectedInterval !== 'weekly' && selectedInterval !== 'monthly') {
      // Check if the interval is yearly or more
      if (snoozeTimeMilliseconds <= snoozeInterval) {
        // If snooze time is less than or equal to the snooze interval (1 hour), snooze is not allowed
        alert('Snooze is not allowed for intervals less than 1 hour.');
        return;
      }
    }

    const newTime = new Date(currentTime + snoozeTimeMilliseconds);
    setSelectedTime(newTime);
    setSnoozeVisible(false);
    setIsSnoozeActive(true);
  };

  useEffect(() => {
    const intervalId = setInterval(updateCurrentDateTime, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const toggleMonthSelection = (month) => {
    if (selectedMonths.includes(month)) {
      setSelectedMonths(selectedMonths.filter((m) => m !== month));
    } else {
      setSelectedMonths([...selectedMonths, month]);
    }
  };

  const addReminder = () => {
    const yearlyInterval = parseInt(selectedYearlyInterval);

    const currentYear = currentDateTime.getFullYear();

    const allReminders = [];

    for (const selectedMonth of selectedMonths) {
      for (let i = 0; i < yearlyInterval; i++) {
        // Calculate the year for the reminder
        const reminderYear = currentYear + (i * yearlyInterval);

        // Calculate the last day of the selected month
        const lastDayOfMonth = new Date(reminderYear, months.indexOf(selectedMonth) + 1, 0).getDate();

        // Parse the selectedDate as an integer
        const selectedDateInt = parseInt(selectedDate);

        // Check if the selected date is valid for the selected month
        if (selectedDateInt >= 1 && selectedDateInt <= lastDayOfMonth) {
          // Create a reminder object
          const newReminder = {
            interval: selectedInterval,
            duration: `${yearlyInterval} year(s)`,
            months: [selectedMonth],
            date: selectedDate,
            time: selectedTime,
            year: reminderYear,
          };

          allReminders.push(newReminder);
        }
      }
    }

    setSelectedReminders([...selectedReminders, ...allReminders]);
  };

  const renderReminderItem = ({ item }) => (
    <View style={{ marginVertical: 10 }}>
      <Text>Interval: {item.interval}</Text>
      <Text>Duration: {item.duration}</Text>
      <Text>Months: {item.months.join(', ')}</Text>
      <Text>Date: {item.date}</Text>
      <Text>Time: {item.time.toLocaleTimeString()}</Text>
      <Text>Year: {item.year}</Text>
    </View>
  );

  return (
    <View>
      <Text style={{ paddingTop: 10 }}>Current Date and Time: {currentDateTime.toLocaleString()}</Text>
      <Text style={{ paddingTop: 10 }}>Select Interval:</Text>
      <Picker
        selectedValue={selectedInterval}
        style={{ height: 50, width: '100%', color: 'red', backgroundColor: '#89CFF0' }}
        onValueChange={(itemValue) => setSelectedInterval(itemValue)}
      >
        <Picker.Item label="Daily" value="daily" />
        <Picker.Item label="Weekly" value="weekly" />
        <Picker.Item label="Monthly" value="monthly" />
        <Picker.Item label="Yearly" value="yearly" />
      </Picker>
      <Text style={{ paddingTop: 10 }}>Select Yearly Duration: {selectedYearlyInterval} year(s)</Text>
      <Picker
        selectedValue={selectedYearlyInterval}
        style={{ width: '100%', color: 'red', backgroundColor: '#89CFF0' }}
        onValueChange={(itemValue) => setSelectedYearlyInterval(itemValue)}
      >
        {intervalValues.map((value) => (
          <Picker.Item key={value} label={`${value} year(s)`} value={value} />
        ))}
      </Picker>
      <Text style={{ paddingTop: 10 }}>Selected Month(s):</Text>
      <ScrollView horizontal={true} style={{ flexDirection: 'row' }}>
        {months.map((month) => (
          <TouchableOpacity
            key={month}
            onPress={() => toggleMonthSelection(month)}
            style={{
              backgroundColor: selectedMonths.includes(month) ? 'lightblue' : 'white',
              padding: 10,
              borderBottomWidth: 1,
              borderColor: 'gray',
              marginRight: 10,
            }}
          >
            <Text style={{ color: "black" }}>{month}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <Text style={{ paddingTop: 10 }}>Selected Months: {selectedMonths.join(', ')}</Text>

      {/* Time Selection */}
      <Button title="Pick Time" onPress={() => setTimePickerVisible(true)} />
      <Text style={{ paddingTop: 10 }}>Select Time: {selectedTime.toLocaleTimeString()}</Text>

      <TouchableOpacity onPress={() => setSnoozeVisible(true)}>
        <View style={{ backgroundColor: 'blue', padding: 10, borderRadius: 5 }}>
          <Text>Snooze is {isSnoozeActive ? 'on' : 'off'}</Text>
        </View>
      </TouchableOpacity>

      {/* DateTimePickerModal for picking time */}
      <DateTimePickerModal
        isVisible={isTimePickerVisible}
        mode="time"
        onConfirm={(time) => {
          setSelectedTime(time);
          setTimePickerVisible(false);
        }}
        onCancel={() => setTimePickerVisible(false)}
      />

      <Picker
        selectedValue={selectedDate}
        style={{ width: '100%', color: 'red', backgroundColor: '#89CFF0', paddingTop: '10%' }}
        onValueChange={(itemValue) => setSelectedDate(itemValue)}
      >
        {dates.map((date) => (
          <Picker.Item key={date} label={date} value={date} />
        ))}
      </Picker>

      <Modal
        visible={isSnoozeVisible}
        transparent={true}
        animationType="slide"
      >
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.7)' }}>
          <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10, width: '80%' }}>
            <Text>Select Snooze Time (minutes)</Text>
            <Picker
              selectedValue={snoozeTime.toString()}
              onValueChange={(itemValue) => setSnoozeTime(itemValue)}
            >
              <Picker.Item label="5" value="5" />
              <Picker.Item label="10" value="10" />
              {/* Add more snooze time options if needed */}
            </Picker>
            <Button title="Snooze" onPress={snoozeReminder} />
            <Button title="Cancel" onPress={() => setSnoozeVisible(false)} />
          </View>
        </View>
      </Modal>

      <Text style={{ paddingTop: 10, }}>Select Date: {selectedDate}</Text>

      <Button title="Add Reminder" onPress={addReminder} />
      <FlatList
        data={selectedReminders}
        renderItem={renderReminderItem}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
};

export default YearlyAll;
