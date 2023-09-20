import React, { useState, useEffect } from "react";
import { View, Text, Button, ScrollView, TouchableOpacity, Modal, Platform, StyleSheet, Alert } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

const MultipleReminderScreen = () => {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [reminders, setReminders] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDates, setSelectedDates] = useState([]);
  const [selectedTimes, setSelectedTimes] = useState([]);
  const [triggeredReminders, setTriggeredReminders] = useState([]);

  const addReminder = () => {
    const newReminder = {
      id: Date.now().toString(),
      dates: selectedDates,
      times: selectedTimes,
    };

    setReminders([...reminders, newReminder]);
    setSelectedDates([]);
    setSelectedTimes([]);
    setSelectedDate(new Date());
    setModalVisible(false);
  };

  const checkReminders = () => {
    const now = new Date();

    // Iterate through reminders
    for (const reminder of reminders) {
      // Check if the reminder has already been triggered
      if (triggeredReminders.includes(reminder.id)) {
        continue; // Skip this reminder
      }

      // Iterate through selected dates within each reminder
      for (const date of reminder.dates) {
        // Check if the selected date and time are equal to the current local time
        if (date.getTime() === now.getTime()) {
          Alert.alert(
            "Wake Up",
            "It's time to wake up!",
            [
              {
                text: "OK",
                onPress: () => {
                  console.log("Wake-up alert acknowledged");
                  // Mark this reminder as triggered
                  setTriggeredReminders([...triggeredReminders, reminder.id]);
                },
              },
            ]
          );
        }
      }

      // Iterate through selected times within each reminder
      for (const time of reminder.times) {
        // Check if the selected time is equal to the current local time
        if (
          time.getHours() === now.getHours() &&
          time.getMinutes() === now.getMinutes()
        ) {
          Alert.alert(
            "Time to do something",
            "It's time to do something!",
            [
              {
                text: "OK",
                onPress: () => {
                  console.log("Time alert acknowledged");
                  // Mark this reminder as triggered
                  setTriggeredReminders([...triggeredReminders, reminder.id]);
                },
              },
            ]
          );
        }
      }
    }
  };

  useEffect(() => {
    const reminderInterval = setInterval(() => {
      checkReminders();
    }, 1000);

    return () => {
      clearInterval(reminderInterval);
    };
  }, [reminders, triggeredReminders]);

  const renderReminders = () => {
    return reminders.map((reminder) => (
      <View key={reminder.id} style={styles.reminderContainer}>
        <Text>Reminder:</Text>
        {reminder.dates.map((date, index) => (
          <Text key={index}>{date.toLocaleString()}</Text>
        ))}
        {reminder.times.map((time, index) => (
          <Text key={index}>{formatTime(time)}</Text>
        ))}
        <TouchableOpacity onPress={() => removeReminder(reminder.id)}>
          <Text style={styles.deleteText}>Delete</Text>
        </TouchableOpacity>
      </View>
    ));
  };

  const formatTime = (time) => {
    return `${time.getHours()}:${time.getMinutes()}`;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Add Reminders</Text>
      <Button title="Add Reminder" onPress={() => setModalVisible(true)} />
      {showDatePicker && (
        <DateTimePicker
          value={selectedDate}
          mode="datetime"
          is24Hour={true}
          display="default"
          onChange={(event, date) => {
            setShowDatePicker(Platform.OS === "ios");
            if (date) {
              setSelectedDate(date);
            }
          }}
        />
      )}
      <ScrollView style={styles.scrollView}>{renderReminders()}</ScrollView>
      <Modal
        animationType="slide"
        transparent={false}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}
      >
        <View style={styles.modalContainer}>
          <DateTimePicker
            value={selectedDate}
            mode="datetime"
            is24Hour={true}
            display="default"
            onChange={(event, date) => {
              if (date) {
                setSelectedDate(date);
              }
            }}
          />
          <Button
            title="Add Date/Time"
            onPress={() => {
              setSelectedDates([...selectedDates, selectedDate]);
              setSelectedTimes([...selectedTimes, selectedDate]);

              Alert.alert(
                "Date/Time Added",
                "Your date and time have been added to the reminder.",
                [
                  {
                    text: "OK",
                    onPress: () => {
                      console.log("Date and time acknowledged");
                    },
                  },
                ]
              );

              setSelectedDate(new Date());
            }}
          />

          <Button title="Add Reminder" onPress={() => addReminder()} />
          <Button title="Cancel" onPress={() => setModalVisible(false)} />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: "20%",
  },
  heading: {
    fontSize: 20,
    marginBottom: 20,
  },
  reminderContainer: {
    flexDirection: "column",
    alignItems: "center",
    marginVertical: 10,
  },
  deleteText: {
    color: "red",
    marginVertical: 5,
  },
  scrollView: {
    flex: 1,
    alignSelf: "stretch",
    marginTop: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default MultipleReminderScreen;
