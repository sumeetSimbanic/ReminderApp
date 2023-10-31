import React from 'react';
import { View, Text, FlatList, Button } from 'react-native';

const ReminderList = ({ reminders, onDelete }) => {
  const renderReminderItem = ({ item, index }) => (
    <View style={{ marginVertical: 10 }}>
      <Text>Interval: {item.interval}</Text>
      <Text>Duration: {item.duration}</Text>
      <Text>Months: {item.months.join(', ')}</Text>
      <Text>Date: {item.date}</Text>
      <Text>Time: {item.time.toLocaleTimeString()}</Text>
      <Text>Year: {item.year}</Text>
      <Button title="Delete" onPress={() => onDelete(index)} />
    </View>
  );

  return (
    <FlatList
      data={reminders}
      renderItem={renderReminderItem}
      keyExtractor={(item, index) => index.toString()}
    />
  );
};

export default ReminderList;
