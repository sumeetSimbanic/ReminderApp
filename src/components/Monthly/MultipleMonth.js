import React, { useState, useEffect } from 'react';
import { View, Button, Text, TextInput, FlatList, TouchableOpacity, Switch } from 'react-native';
import * as Notifications from 'expo-notifications';
import { Picker } from '@react-native-picker/picker';


export default function MultipleMonth() {
    const [selectedMonth, setSelectedMonth] = useState(new Date());
    const [occurrences, setOccurrences] = useState([]);
    const [reminders, setReminders] = useState([]);
    const [newReminderText, setNewReminderText] = useState('');
    const [selectedOccurrence, setSelectedOccurrence] = useState(null); // State for selected occurrence
    const [showCompleted, setShowCompleted] = useState(false);
  
    useEffect(() => {
      // Update occurrences when the selected month changes
      calculateOccurrences(selectedMonth);
    }, [selectedMonth]);
  
    // Function to calculate occurrences for the selected month
    const calculateOccurrences = (date) => {
      const year = date.getFullYear();
      const month = date.getMonth();
  
      const result = [];
      const daysInMonth = new Date(year, month + 1, 0).getDate();
  
      // Loop through all possible days in the month
      for (let day = 1; day <= daysInMonth; day++) {
        const currentDate = new Date(year, month, day);
        const occurrence = getOccurrenceOfDay(currentDate);
  
        if (occurrence) {
          result.push(occurrence); // Store occurrence names
        }
      }
  
      setOccurrences(result);
    };
  
    // Function to add a new reminder based on the selected occurrence
    const addReminderFromOccurrence = () => {
      if (selectedOccurrence) {
        setReminders([...reminders, { text: selectedOccurrence, completed: false }]);
        setSelectedOccurrence(null); // Reset selected occurrence
      }
    };
  
  // Function to schedule reminders
  const scheduleReminders = () => {
    occurrences.forEach((occurrenceData) => {
      const { date, occurrence } = occurrenceData;

      Notifications.scheduleNotificationAsync({
        content: {
          title: `${occurrence} Reminder`,
          body: `This is a reminder for ${occurrence} of the month.`,
        },
        trigger: {
          date,
        },
      });
    });

    alert('Reminders scheduled successfully.');
  };
// Function to add a new reminder
const addReminder = () => {
    if (newReminderText.trim() !== '') {
      setReminders([...reminders, { text: newReminderText, completed: false }]);
      setNewReminderText('');
    }
  };
  
  // Function to toggle the completion status of a reminder
  const toggleReminderCompletion = (index) => {
    const updatedReminders = [...reminders];
    updatedReminders[index].completed = !updatedReminders[index].completed;
    setReminders(updatedReminders);
  };
  
  // Function to determine the occurrence of a specific day (e.g., first, second, third)
  const getOccurrenceOfDay = (date) => {
    const dayOfWeek = date.getDay();
    const dayOfMonth = date.getDate();
  
    if (dayOfMonth <= 7 && dayOfWeek === 0) {
      return 'first Sunday';
    }
  
    if (dayOfMonth <= 7) {
      return `first ${getDayName(dayOfWeek)}`;
    }
  
    if (dayOfMonth <= 14 && dayOfWeek === 0) {
      return 'second Sunday';
    }
  
    if (dayOfMonth <= 14) {
      return `second ${getDayName(dayOfWeek)}`;
    }
  
    if (dayOfMonth <= 21 && dayOfWeek === 0) {
      return 'third Sunday';
    }
  
    if (dayOfMonth <= 21) {
      return `third ${getDayName(dayOfWeek)}`;
    }
  
    if (dayOfMonth <= 28 && dayOfWeek === 0) {
      return 'fourth Sunday';
    }
  
    if (dayOfMonth <= 28) {
      return `fourth ${getDayName(dayOfWeek)}`;
    }
  
    if (dayOfWeek === 0) {
      return 'last Sunday';
    }
  
    return `last ${getDayName(dayOfWeek)}`;
  };
  
  // Function to convert day of the week number to its name
  const getDayName = (dayOfWeek) => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[dayOfWeek];
  };
  
  // Rest of your code for adding and managing reminders remains the same

  return (
    <View>
    <Text>Select a month to set reminders:</Text>
    <Button title="Calculate Occurrences" onPress={() => calculateOccurrences(selectedMonth)} />
    <Text>Selected Month: {selectedMonth.toLocaleDateString()}</Text>

    {/* Input to add a new reminder */}
    <TextInput
      placeholder="Enter a new reminder"
      value={newReminderText}
      onChangeText={(text) => setNewReminderText(text)}
    />
    <Button title="Add Reminder" onPress={addReminderFromOccurrence} /> {/* Use addReminderFromOccurrence function */}
    
    {/* Select an occurrence from the list */}
    <Text>Select an Occurrence:</Text>
    <Picker
      selectedValue={selectedOccurrence}
      onValueChange={(itemValue) => setSelectedOccurrence(itemValue)}
    >
      <Picker.Item label="Select an Occurrence" value={null} />
      {occurrences.map((occurrence, index) => (
        <Picker.Item key={index} label={occurrence} value={occurrence} />
      ))}
    </Picker>

    {/* Toggle switch to show/hide completed reminders */}
    <View>
      <Text>Show Completed</Text>
      <Switch value={showCompleted} onValueChange={(value) => setShowCompleted(value)} />
    </View>

    {/* List of reminders */}
    <FlatList
      data={showCompleted ? reminders : reminders.filter((reminder) => !reminder.completed)}
      renderItem={({ item, index }) => (
        <TouchableOpacity
          onPress={() => toggleReminderCompletion(index)}
          style={{
            backgroundColor: item.completed ? 'lightgray' : 'white',
            padding: 10,
            marginBottom: 5,
          }}
        >
          <Text style={{ textDecorationLine: item.completed ? 'line-through' : 'none' }}>
            {item.text}
          </Text>
        </TouchableOpacity>
      )}
      keyExtractor={(item, index) => index.toString()}
      extraData={reminders}
    />

    <Button title="Set Reminders" onPress={scheduleReminders} />
  </View>
  );
}
