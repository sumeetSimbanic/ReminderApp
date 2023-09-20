import React, { useState, useEffect } from 'react';
import { View, Button, Platform, TimePickerIOS, Alert } from 'react-native';
import { Notifications } from 'expo';
import DateTimePicker from '@react-native-community/datetimepicker'; // Import DateTimePicker

import * as Permissions from 'expo-permissions';
import * as BackgroundFetch from 'expo-background-fetch';
import * as TaskManager from 'expo-task-manager';

const TASK_NAME = 'notificationTask';

const NotificationScheduler = () => {
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);

  useEffect(() => {
    // Register a background task to handle notifications
    TaskManager.defineTask(TASK_NAME, () => {
      sendScheduledNotification();
      return BackgroundFetch.Result.NewData;
    });

    // Request notification permissions when the component mounts
    requestNotificationPermissions();

    return () => {
      // Unregister the task when the component unmounts
      TaskManager.unregisterAllTasksAsync();
    };
  }, []);

  // Function to request notification permissions
  const requestNotificationPermissions = async () => {
    try {
      const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);

      if (status !== 'granted') {
        Alert.alert('Permission denied', 'You must allow notifications to use this feature.');
      }
    } catch (error) {
      console.error('Error requesting notification permissions:', error);
    }
  };

  // Function to send a scheduled notification
  const sendScheduledNotification = async () => {
    try {
      const selectedDate = new Date(date);
      const selectedTime = new Date(time);

      // Combine the selected date and time
      selectedDate.setHours(selectedTime.getHours());
      selectedDate.setMinutes(selectedTime.getMinutes());

      // Create a notification
      const notification = {
        content: {
          title: 'Your notification title',
          body: 'Your notification body',
        },
        trigger: {
          date: selectedDate, // Set the trigger date and time
        },
      };

      // Send the notification
      await Notifications.scheduleNotificationAsync(notification);
    } catch (error) {
      console.error('Error scheduling notification:', error);
    }
  };

  const handlerShowTimePicker = () => {
    setShowTimePicker(true); // Set showTimePicker to true to display the time picker
  };

  const onTimeChange = (event, selectedTime) => {
    setShowTimePicker(false); // Hide the time picker
    if (selectedTime !== undefined) {
      setTime(selectedTime);
    }
  };

  const scheduleNotification = () => {
    // Schedule the notification using a background task
    BackgroundFetch.registerTaskAsync(TASK_NAME)
      .then(() => {
        // You can also unregister the task if needed
        // BackgroundFetch.unregisterTaskAsync(TASK_NAME);
      })
      .catch((error) => {
        console.error('Error registering background task:', error);
      });
  };

  return (
    <View>
      <DateTimePicker // Use DateTimePicker for iOS
        mode="date"
        value={date}
        onChange={(event, selectedDate) => setDate(selectedDate)}
      />
      <Button title="Set Time" onPress={handlerShowTimePicker} />

      {Platform.OS === 'ios' && showTimePicker && (
        <DateTimePicker // Use DateTimePicker for iOS
          mode="time"
          value={time}
          onChange={onTimeChange}
        />
      )}

      {Platform.OS === 'ios' ? (
        <TimePickerIOS mode="time" date={time} onDateChange={setTime} />
      ) : null}

      <Button title="Schedule Notification" onPress={scheduleNotification} />
    </View>
  );
};

export default NotificationScheduler;
