import React, { useState, useEffect } from 'react';
import { View, Text, Button, ToastAndroid, TextInput, FlatList } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import * as Notifications from 'expo-notifications';
import { useNavigation } from '@react-navigation/native';


export default function MultiTimeReminder() {
  const [selectedTimes, setSelectedTimes] = useState([]);
  const [timeInput, setTimeInput] = useState('');
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [reminders, setReminders] = useState([]);
  const navigation = useNavigation();


  useEffect(() => {
    // Check for reminders when the component mounts
    checkReminders();
  }, []);

  const showTimePickerModal = () => {
    setShowTimePicker(true);
  };

  const hideTimePickerModal = () => {
    setShowTimePicker(false);
  };

  const handleTimePickerConfirm = (selectedTime) => {
    hideTimePickerModal();

    if (selectedTime) {
      setSelectedTimes([...selectedTimes, selectedTime]);
      setTimeInput('');
    }
  };
  const checkReminders = async () => {
    const pendingNotifications = await Notifications.getAllScheduledNotificationsAsync();
    const now = new Date().getTime(); // Get the current time in milliseconds
  
    for (const notification of pendingNotifications) {
      if (notification.trigger.timestamp <= now) {
        // Cancel the pending notification
        await Notifications.cancelScheduledNotificationAsync(notification.identifier);
  
        // Schedule the same notification immediately
        await Notifications.scheduleNotificationAsync({
          content: notification.request.content,
        });
      }
    }
  };
  
  const setReminder = async () => {
    if (selectedTimes.length === 0) {
      ToastAndroid.show('Please select at least one time', ToastAndroid.SHORT);
      return;
    }
  
    const newReminders = [];
  
    for (let i = 0; i < selectedTimes.length; i++) {
      const selectedTime = selectedTimes[i];
      const now = new Date();
      const year = now.getFullYear();
      const month = now.getMonth();
      const day = now.getDate();
      const hour = selectedTime.getHours();
      const minute = selectedTime.getMinutes();
  
      const reminderTime = new Date(year, month, day, hour, minute);
  
      // Set a notification for each selected time
      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Reminder',
          body: "It's time for your task!",
        },
        trigger: {
          date: reminderTime,
        },
      });
  
      // Add the reminder details to the array
      newReminders.push({
        id: i.toString(),
        time: reminderTime.toLocaleString(),

      });
    }
    
  
    // Update the reminders array with the new reminders
    setReminders(newReminders);
  
    ToastAndroid.show('Reminders set successfully', ToastAndroid.SHORT);
  };
  
 

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Set Multi-Time Reminder</Text>
      <Button title="Select Time" onPress={showTimePickerModal} />
      <Button title="Set Reminder" onPress={setReminder} />
      <Text>Selected Times:</Text>
      <FlatList
        data={selectedTimes}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={{ marginTop: 10 }}>
            <Text>{item.toLocaleString()}</Text>
          </View>
        )}
      />

      <DateTimePickerModal
        isVisible={showTimePicker}
        mode="time"
        onConfirm={handleTimePickerConfirm}
        onCancel={hideTimePickerModal}
      />
    </View>
  );
}
