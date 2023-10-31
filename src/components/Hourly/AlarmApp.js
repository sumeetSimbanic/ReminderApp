// import React, { useState } from 'react';
// import { View, Text, Button } from 'react-native';
// import DateTimePickerModal from 'react-native-modal-datetime-picker';
// import { NavigationContainer } from '@react-navigation/native';
// import { createStackNavigator } from '@react-navigation/native';

// const Stack = createStackNavigator();

// const AlarmApp = ({ navigation }) => {
//   const [isDateTimePickerVisible, setDateTimePickerVisibility] = useState(false);
//   const [selectedDate, setSelectedDate] = useState(null);
//   const [isAlarmSet, setIsAlarmSet] = useState(false);

//   const showDateTimePicker = () => {
//     setDateTimePickerVisibility(true);
//   };

//   const hideDateTimePicker = () => {
//     setDateTimePickerVisibility(false);
//   };

//   const handleDatePicked = (date) => {
//     setSelectedDate(date);
//     hideDateTimePicker();
//   };

//   const setAlarm = () => {
//     // Implement alarm setting logic here using the selectedDate state
//     console.log('Alarm set for:', selectedDate);
//     // You can use a library like react-native-push-notification for setting alarms

//     // Check if the selected time matches the current time
//     const currentTime = new Date();
//     if (selectedDate && selectedDate.getTime() === currentTime.getTime()) {
//       // If the times match, navigate to the alarm screen
//       navigation.navigate('AlarmScreen');
//     } else {
//       setIsAlarmSet(true);
//     }
//   };

//   return (
//     <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//       <Button title="Set Alarm" onPress={showDateTimePicker} />
//       <Button title="Confirm Alarm" onPress={setAlarm} />
//       <DateTimePickerModal
//         isVisible={isDateTimePickerVisible}
//         mode="datetime"
//         onConfirm={handleDatePicked}
//         onCancel={hideDateTimePicker}
//       />
//       {isAlarmSet && (
//         <Text>Selected Date: {selectedDate ? selectedDate.toLocaleString() : 'None'}</Text>
//       )}
//     </View>
//   );
// };

// export default AlarmApp