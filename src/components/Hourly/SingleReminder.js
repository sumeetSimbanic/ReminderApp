import React, { useState, useEffect } from 'react';
import { View, Text, Button, ToastAndroid } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { Audio } from 'expo-av';
import * as Notifications from 'expo-notifications';
import { useNavigation } from '@react-navigation/native';

export default function SingleReminder() {
  const [selectedDateTime, setSelectedDateTime] = useState(null);
  const [snoozeEnabled, setSnoozeEnabled] = useState(false);
  const [sound, setSound] = useState();
  const [alarmDetails, setAlarmDetails] = useState(null);
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

  const showDateTimePicker = () => {
    setSelectedDateTime(new Date());
  };

  const hideDateTimePicker = () => {
    setSelectedDateTime(null);
  };

  const handleDateTimePickerConfirm = (selectedDateTime) => {
    hideDateTimePicker();

    if (selectedDateTime) {
      setAlarmDetails({
        date: selectedDateTime.toLocaleDateString(),
        time: selectedDateTime.toLocaleTimeString(),
        snooze: snoozeEnabled ? 'On' : 'Off',
      });
    }
  };

  const scheduleNotification = async () => {
    if (!selectedDateTime) {
      ToastAndroid.show('Please select a date and time', ToastAndroid.SHORT);
      return;
    }

    const now = new Date().getTime();
    const reminderTime = selectedDateTime.getTime();
    const snoozeDuration = snoozeEnabled ? 5 * 60 * 1000 : 0;

    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Alarm',
          body: 'Time to wake up!',
        },
        trigger: {
          date: new Date(reminderTime + snoozeDuration),
        },
      });
    } catch (error) {
      console.error('Error scheduling notification:', error);
    }

    ToastAndroid.show('Alarm set successfully', ToastAndroid.SHORT);
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Set Alarm</Text>
      <Button title="Select Date and Time" onPress={showDateTimePicker} />

      {selectedDateTime && (
        <View>
          <Text>Selected Date and Time:</Text>
          <Text>Date: {selectedDateTime.toLocaleDateString()}</Text>
          <Text>Time: {selectedDateTime.toLocaleTimeString()}</Text>
        </View>
      )}

      <Button title={`Snooze: ${snoozeEnabled ? 'On' : 'Off'}`} onPress={() => setSnoozeEnabled(!snoozeEnabled)} />

      <Button
        title="Set Alarm"
        onPress={() => {
          if (selectedDateTime) {
            scheduleNotification();
          }
        }}
      />

      <DateTimePickerModal
        isVisible={selectedDateTime !== null}
        mode="datetime"
        onConfirm={(dateTime) => handleDateTimePickerConfirm(dateTime)}
        onCancel={hideDateTimePicker}
      />

      {alarmDetails && (
        <View>
          <Text>Alarm Details:</Text>
          <Text>Date: {alarmDetails.date}</Text>
          <Text>Time: {alarmDetails.time}</Text>
          <Text>Snooze: {alarmDetails.snooze}</Text>
        </View>
      )}
    </View>
  );
}
