import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, FlatList, TouchableOpacity, Button } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { useNavigation } from '@react-navigation/native';
import { useReminder } from '../../context/ReminderContext';



const dayOfWeekOptions = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const occurrenceOptions = ['First', 'Second', 'Third', 'Fourth', 'Last'];

const YearlyAllTwo = () => {
  const [selectedInterval, setSelectedInterval] = useState('daily');
  const [selectedDuration, setSelectedDuration] = useState('1');
  const [selectedYearlyInterval, setSelectedYearlyInterval] = useState('1');
  const [selectedMonths, setSelectedMonths] = useState([]);
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [selectedReminders, setSelectedReminders] = useState([]);
  const [selectedDayOfWeek, setSelectedDayOfWeek] = useState('Sunday');
  const [selectedOccurrence, setSelectedOccurrence] = useState('First');
  const [maxIntervalValue] = useState(10);
  const [intervalValues] = useState(Array.from({ length: maxIntervalValue }, (_, i) => (i + 1).toString()));
  const [months] = useState([
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]);
  const [isTimePickerVisible, setTimePickerVisible] = useState(false);
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const navigation = useNavigation();
  const { reminders, dispatch } = useReminder();



  const updateCurrentDateTime = () => {
    setCurrentDateTime(new Date());
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
    // Calculate the reminder data
    const yearlyInterval = parseInt(selectedYearlyInterval);
    const currentYear = currentDateTime.getFullYear();
    const allReminders = [];
  
    for (const selectedMonth of selectedMonths) {
      for (let i = 0; i < yearlyInterval; i++) {
        const reminderYear = currentYear + (i * yearlyInterval);
        const dayOfWeekIndex = dayOfWeekOptions.indexOf(selectedDayOfWeek);
        const occurrenceIndex = occurrenceOptions.indexOf(selectedOccurrence);
  
        const date = calculateDateByDayAndOccurrence(reminderYear, selectedMonth, dayOfWeekIndex, occurrenceIndex);
  
        if (date) {
          // Convert the Date object to a string
          const serializedTime = selectedTime.toISOString();
          
          const newReminder = {
            interval: selectedInterval,
            duration: `${yearlyInterval} year(s)`,
            months: [selectedMonth],
            date: date.toLocaleDateString(),
            time: serializedTime, // Store the time as a string
            year: reminderYear,
          };
  
          allReminders.push(newReminder);
          // console.log('New Reminder:', newReminder);

        }
      }
    }
  
    // Dispatch an action to update reminders in the context
    dispatch({ type: 'ADD_REMINDER', payload: allReminders });
    
    // Navigate to the "AllReminderList" screen with the updated reminders
    navigation.navigate('Allreminderlist', { reminders: allReminders });
  };
  
  const calculateDateByDayAndOccurrence = (year, month, dayOfWeekIndex, occurrenceIndex) => {
    const firstDayOfMonth = new Date(year, months.indexOf(month), 1);
    const daysUntilDayOfWeek = (dayOfWeekIndex - firstDayOfMonth.getDay() + 7) % 7;
    const dayOfMonth = 1 + daysUntilDayOfWeek + occurrenceIndex * 7;

    if (dayOfMonth <= new Date(year, months.indexOf(month) + 1, 0).getDate()) {
      return new Date(year, months.indexOf(month), dayOfMonth);
    }

    return null; // Invalid date
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
            <Text style={{ color:"black" }}>{month}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <Text style={{ paddingTop: 10 }}>Selected Months: {selectedMonths.join(', ')}</Text>

      <Button title="Pick Time" onPress={() => setTimePickerVisible(true)} />
      <Text style={{ paddingTop: 10 }}>Select Time: {selectedTime.toLocaleTimeString()}</Text>

      <DateTimePickerModal
        isVisible={isTimePickerVisible}
        mode="time"
        onConfirm={(time) => {
          setSelectedTime(time);
          setTimePickerVisible(false);
        }}
        onCancel={() => setTimePickerVisible(false)}
      />

    
       <Text style={{ paddingTop: 10 }}>Select Day of the Week:</Text>
      <Picker
        selectedValue={selectedDayOfWeek}
        style={{ width: '100%', color: 'red', backgroundColor: '#89CFF0', paddingTop: '10%' }}
        onValueChange={(itemValue) => setSelectedDayOfWeek(itemValue)}
      >
        {dayOfWeekOptions.map((day) => (
          <Picker.Item key={day} label={day} value={day} />
        ))}
      </Picker>

      <Text style={{ paddingTop: 10 }}>Select Occurrence:</Text>
      <Picker
        selectedValue={selectedOccurrence}
        style={{ width: '100%', color: 'red', backgroundColor: '#89CFF0', paddingTop: '10%' }}
        onValueChange={(itemValue) => setSelectedOccurrence(itemValue)}
      >
        {occurrenceOptions.map((occurrence) => (
          <Picker.Item key={occurrence} label={occurrence} value={occurrence} />
        ))}
      </Picker>

      <Button title="Add Reminder" onPress={addReminder} />
      
    </View>
  );
};

export default YearlyAllTwo;
