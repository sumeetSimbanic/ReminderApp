import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, FlatList, TouchableOpacity, Modal, Button } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { Picker } from '@react-native-picker/picker';
import { createTable, getTableFields, addReminderToDatabase, retrieveRemindersFromDatabase } from './ReminderService';
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase({ name: 'mydatabase.db', location: 'default' });

const DataYear = () => {
  const [selectedInterval, setSelectedInterval] = useState('daily');
  const [selectedDuration, setSelectedDuration] = useState('1');
  const [selectedYearlyInterval, setSelectedYearlyInterval] = useState('1');
  const [isSnoozeVisible, setSnoozeVisible] = useState(false);
  const [snoozeTime, setSnoozeTime] = useState(5); 
  const [snoozeInterval, setSnoozeInterval] = useState(60 * 60 * 1000); 
  const [databaseData, setDatabaseData] = useState([]);

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
  const toggleMonthSelection = (month) => {
    if (selectedMonths.includes(month)) {
      setSelectedMonths(selectedMonths.filter((m) => m !== month));
    } else {
      setSelectedMonths([...selectedMonths, month]);
    }
  };

  const snoozeReminder = () => {
    const currentTime = selectedTime.getTime();
    const snoozeTimeMinutes = parseInt(snoozeTime); 

    if (snoozeTimeMinutes < snoozeInterval) {
      alert('Snooze is not allowed for intervals less than the snooze interval.');
      return;
    }

    const newTime = new Date(currentTime + snoozeTimeMinutes * 60 * 1000); 
    setSelectedTime(newTime);
    setSnoozeVisible(false);
    setIsSnoozeActive(true);
  };
   
  const addReminder = () => {
    const yearlyInterval = parseInt(selectedYearlyInterval);
    const currentYear = currentDateTime.getFullYear();
    const allReminders = [];

    for (const selectedMonth of selectedMonths) {
      for (let i = 0; i < yearlyInterval; i++) {
        const reminderYear = currentYear + i * yearlyInterval;
        const lastDayOfMonth = new Date(reminderYear, months.indexOf(selectedMonth) + 1, 0).getDate();
        const selectedDateInt = parseInt(selectedDate);

        if (selectedDateInt >= 1 && selectedDateInt <= lastDayOfMonth) {
          const newReminder = {
            interval: selectedInterval,
            duration: `${yearlyInterval} year(s)`,
            months: [selectedMonth],
            date: selectedDate,
            time: selectedTime.toLocaleTimeString(),
            year: reminderYear,
          };

          allReminders.push(newReminder);
        }
      }
    }

    retrieveRemindersFromDatabase();

    db.transaction((tx) => {
      allReminders.forEach((reminder) => {
        tx.executeSql(
          'INSERT INTO reminders (interval, duration, months, date, time, year) VALUES (?, ?, ?, ?, ?, ?)',
          [reminder.interval, reminder.duration, reminder.months.join(', '), reminder.date, reminder.time, reminder.year],
          (tx, results) => {
            console.log('Reminder inserted successfully');
          },
          (error) => {
            console.error('Error inserting reminder: ', error);
          }
        );
      });
    });

    setSelectedReminders([...selectedReminders, ...allReminders]);
  };

  // const retrieveReminders = () => {
  //   db.transaction((tx) => {
  //     tx.executeSql(
  //       'SELECT * FROM reminders',
  //       [],
  //       (_, { rows }) => {
  //         const reminders = rows._array;
  //         setDatabaseData(reminders);
  //       },
  //       (_, error) => {
  //         console.error('Error retrieving reminders from the database', error);
  //       }
  //     );
  //   });
  // };

  useEffect(() => {
    retrieveRemindersFromDatabase();
  }, []);
  const renderReminderItem = ({ item, index }) => (
    <View style={{ marginVertical: 10 }}>
      <Text>Interval: {item.interval}</Text>
      <Text>Duration: {item.duration}</Text>
      <Text>Months: {item.months}</Text>
      <Text>Date: {item.date}</Text>
      <Text>Time: {item.time}</Text>
      <Text>Year: {item.year}</Text>
      <Button
        title="Delete"
        onPress={() => handleDeleteReminder(index)}
      />
    </View>
  );
  const handleDeleteReminder = (index) => {
    const updatedReminders = [...selectedReminders];
    updatedReminders.splice(index, 1);
    setSelectedReminders(updatedReminders);
  
    const reminderToDelete = selectedReminders[index];
    db.transaction((tx) => {
      tx.executeSql(
        'DELETE FROM reminders WHERE interval = ? AND duration = ? AND date = ? AND time = ? AND year = ?',
        [
          reminderToDelete.interval,
          reminderToDelete.duration,
          reminderToDelete.date,
          reminderToDelete.time,
          reminderToDelete.year,
        ],
        (tx, results) => {
          console.log('Reminder deleted successfully');
        },
        (error) => {
          console.error('Error deleting reminder: ', error);
        }
      );
    });
  };
    
  const renderDatabaseDataItem = ({ item }) => (
    <View style={{ flexDirection: 'row', padding: 10 }}>
      <View style={{ flex: 1 }}>
        <Text>{item.interval}</Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text>{item.duration}</Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text>{item.months}</Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text>{item.date}</Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text>{item.time}</Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text>{item.year}</Text>
      </View>
    </View>
  );
  
  return (
    <View>
      {/* <Text style={{ paddingTop: 10 }}>Current Date and Time: {currentDateTime.toLocaleString()}</Text> */}
      <Text style={{paddingTop:20}}>Yearly Reminder</Text>
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

      <Button title="Pick Time" onPress={() => setTimePickerVisible(true)} />
      <Text style={{ paddingTop: 10 }}>Select Time: {selectedTime.toLocaleTimeString()}</Text>

      {/* <TouchableOpacity onPress={() => setSnoozeVisible(true)}>
        <View style={{ backgroundColor: 'blue', padding: 10, borderRadius: 5 }}>
          <Text>Snooze is {isSnoozeActive ? 'on' : 'off'}</Text>
        </View>
      </TouchableOpacity> */}

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
              selectedValue={snoozeTime}
              onValueChange={(itemValue) => setSnoozeTime(itemValue)}
            >
              <Picker.Item label="5 minutes" value="5" />
              <Picker.Item label="10 minutes" value="10" />
            </Picker>
            <Button title="Snooze" onPress={snoozeReminder} />
            <Button title="Cancel" onPress={() => setSnoozeVisible(false)} />
          </View>
        </View>
      </Modal>

      <Text style={{ paddingTop: 10 }}>Select Date: {selectedDate}</Text>

      <Button title="Add Reminder" onPress={addReminder} />
      <FlatList
        data={selectedReminders}
        renderItem={renderReminderItem}
        keyExtractor={(item, index) => index.toString()}
      />
     
    </View>
  );
};

export default DataYear;
