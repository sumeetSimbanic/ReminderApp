import React, { useState, useEffect } from 'react';
import { View, Text, Button, ToastAndroid, TextInput, FlatList } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import * as Notifications from 'expo-notifications';
import { Audio } from 'expo-av';
import { useNavigation } from '@react-navigation/native';


export default function HourlyReminder() {
  const [startDateTime, setStartDateTime] = useState(null);
  const [endDateTime, setEndDateTime] = useState(null);
  const [intervalMinutes, setIntervalMinutes] = useState('');
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [reminders, setReminders] = useState([]);
  const [sound, setSound] = useState();
  const navigation = useNavigation();


  useEffect(() => {
    const loadSound = async () => {
      try {
        const { sound } = await Audio.Sound.createAsync(
          require('../../../assets/BestTune.mp3')
        );
        setSound(sound);
      } catch (error) {
        console.error('Error loading sound:', error);
      }
    };
    
    loadSound();

    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, []);

  const showDateTimePicker = (type) => {
    if (type === 'start') {
      setShowStartPicker(true);
    } else {
      setShowEndPicker(true);
    }
  };

  const hideDateTimePicker = () => {
    setShowStartPicker(false);
    setShowEndPicker(false);
  };

  const handleDateTimePickerConfirm = (selectedDateTime, type) => {
    hideDateTimePicker();

    if (selectedDateTime) {
      if (type === 'start') {
        setStartDateTime(selectedDateTime);
      } else {
        setEndDateTime(selectedDateTime);
      }
    }
  };

  const scheduleReminders = async () => {
    if (!startDateTime || !endDateTime || !intervalMinutes) {
      ToastAndroid.show('Please select start date and time, end date and time, and interval', ToastAndroid.SHORT);
      return;
    }

    if (endDateTime <= startDateTime) {
      ToastAndroid.show('End date and time must be after start date and time', ToastAndroid.SHORT);
      return;
    }

    // Check if the start and end dates are on the same day
    const startDay = startDateTime.getDate();
    const endDay = endDateTime.getDate();
    if (startDay !== endDay) {
      ToastAndroid.show('Reminders can only be set for one day', ToastAndroid.SHORT);
      return;
    }

    const intervalMilliseconds = intervalMinutes * 60 * 1000; // Convert minutes to milliseconds

    const now = new Date().getTime();
    const firstReminderTime = startDateTime.getTime();
    const lastReminderTime = endDateTime.getTime();

    if (firstReminderTime >= lastReminderTime) {
      ToastAndroid.show('End date and time must be after start date and time', ToastAndroid.SHORT);
      return;
    }

    // Calculate the number of reminders based on the interval
    const numberOfReminders = Math.floor((lastReminderTime - firstReminderTime) / intervalMilliseconds);

    const newReminders = [];

    for (let i = 0; i <= numberOfReminders; i++) {
      const reminderTime = firstReminderTime + i * intervalMilliseconds;

      // Set a notification for each reminder time
      try {
        await Notifications.scheduleNotificationAsync({
          content: {
            title: 'Alarm',
            body: 'Time to wake up!',
          },
          trigger: {
            date: new Date(reminderTime),
          },
        });
      } catch (error) {
        console.error('Error scheduling notification:', error);
      }

      // Play the sound when the alarm goes off
      if (sound) {
        // Play the sound when the alarm goes off
        setTimeout(async () => {
          await sound.replayAsync();
          navigation.navigate('Hourly');
        }, reminderTime - now);
      }

      // Add the reminder details to the array
      newReminders.push({
        id: i.toString(),
        time: new Date(reminderTime).toLocaleString(),
      });
    }

    // Update the reminders array with the new reminders
    setReminders(newReminders);

    ToastAndroid.show('Alarms set successfully', ToastAndroid.SHORT);
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Set Alarm</Text>
      <Button title="Select Start Date and Time" onPress={() => showDateTimePicker('start')} />
      <Text>Start Date and Time: {startDateTime && startDateTime.toLocaleString()}</Text>
      <Button title="Select End Date and Time" onPress={() => showDateTimePicker('end')} />
      <Text>End Date and Time: {endDateTime && endDateTime.toLocaleString()}</Text>
      <TextInput
        placeholder="Enter Interval in Minutes"
        keyboardType="numeric"
        value={intervalMinutes}
        onChangeText={(text) => setIntervalMinutes(text)}
        style={{ marginTop: 10, paddingHorizontal: 10, height: 40, width: 200, borderColor: 'gray', borderWidth: 1 }}
      />
      <Button title="Set Alarms" onPress={scheduleReminders} />

      <FlatList
        data={reminders}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={{ marginTop: 10 }}>
            <Text>{item.time}</Text>
          </View>
        )}
      />

      <DateTimePickerModal
        isVisible={showStartPicker}
        mode="datetime"
        onConfirm={(selectedDateTime) => handleDateTimePickerConfirm(selectedDateTime, 'start')}
        onCancel={hideDateTimePicker}
      />

      <DateTimePickerModal
        isVisible={showEndPicker}
        mode="datetime"
        onConfirm={(selectedDateTime) => handleDateTimePickerConfirm(selectedDateTime, 'end')}
        onCancel={hideDateTimePicker}
      />
    </View>
  );
}
