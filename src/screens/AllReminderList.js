import React from 'react';
import { View, Text, FlatList, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useReminder } from '../context/ReminderContext';

const AllReminderList = () => {
  const navigation = useNavigation();
  const { reminders, dispatch } = useReminder();
  // console.log('ypppp', reminders); 

  const deleteReminder = (index) => {
    // Dispatch an action to delete the reminder
    dispatch({ type: 'DELETE_REMINDER', payload: index });
  };

  const renderReminderItem = ({ item, index }) => {
    console.log('Itemssssss:', item); 
    return (
      <View style={{ marginVertical: 10 }}>
        <Text>Interval: {item.interval}</Text>
        <Text>Duration: {item.duration}</Text>
        <Text>Months:{item.months?.join(', ')}</Text>
        <Text>Date: {item.date}</Text>
        <Text>Time: {new Date(item.time).toLocaleTimeString()}</Text>
        <Text>Year: {item.year}</Text>
        <Button title="Delete" onPress={() => deleteReminder(index)} />
      </View>
    );
  };
  

  return (
    <View>
      <Button title="Go Back" onPress={() => navigation.goBack()} />
      <FlatList
        data={reminders}
        renderItem={renderReminderItem}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
};

export default AllReminderList;
