import React from "react";


import YearlyReminder from "./src/components/Yearly/YearlyReminder";
import YearlyReminderTwo from "./src/components/Yearly/YearlyReminderTwo";
import YearlyAll from "./src/components/Yearly/YearlyAll";
import YearlyAllTwo from "./src/components/Yearly/YearlyAllTwo";
import OptionScreen from "./src/screens/OptionScreen";
import HourlyReminder from "./src/components/Hourly/HourlyReminder"
import MultiTimeReminder from "./src/components/Hourly/MultiTimeReminder";
import DateRangeReminder from "./src/components/Daily/DateRangeReminder";
import DailyMultipleTimeReminder from "./src/components/Daily/MultipleTimeReminder";
import TimeRangeReminder from "./src/components/Daily/TimeRangeReminder";
import WeeklyDuration from "./src/components/Weekly/Weeklyduration";
import WeeklyDurationTime from "./src/components/Weekly/WeeklyDurationTime";
import WeeklySelectedDay from "./src/components/Weekly/WeeklySelectedDay.";
import CustomMonthlyReminder from "./src/components/Monthly/CustomMonthlyReminder";
import MultipleMonth from "./src/components/Monthly/MultipleMonth";
// import MultipleTimeOnceMonth from "./src/components/Monthly/MultipleTimeOnceMonth";
// import OccurrenceTwo from "./src/components/Monthly/OccurenceTwo";
import OnceMonthReminder from "./src/components/Monthly/OnceMonthReminder";
import MonthlyOccurence from "./src/components/Monthly/MonthlyOccurence";
import MonthlyOccurrenceTwo from "./src/components/Monthly/MonthlyOccurenceTwo";
import MultipleDateMonth from "./src/components/Monthly/MultipleDateMonth";
import ReminderList from "./src/screens/ReminderList";
import AllReminderList from "./src/screens/AllReminderList";
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import { ReminderProvider } from './src/context/ReminderContext';
import AlarmScreen from "./src/screens/AlarmScreen";
import AlarmApp from "./src/components/Hourly/AlarmApp";
import SingleReminder from "./src/components/Hourly/SingleReminder";
import DataYear from "./src/screens/DataYear";



const Stack = createStackNavigator();

const MainScreen = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>

      <Stack.Screen name="Reminder" component={OptionScreen} />
      <Stack.Screen name="Hourly" component={HourlyReminder} />
      <Stack.Screen name="HourlyMultiple" component={MultiTimeReminder} />
      <Stack.Screen name="DailyDateRangeReminder" component={DateRangeReminder} />
      <Stack.Screen name="DailyMultipleTimeReminder" component={DailyMultipleTimeReminder} />
      <Stack.Screen name="DailyTimerangeReminder" component={TimeRangeReminder} />
      <Stack.Screen name="WeeklyDuration" component={WeeklyDuration} />
      <Stack.Screen name="WeeklyDurationTime" component={WeeklyDurationTime} />
      <Stack.Screen name="WeeklySelectedDay" component={WeeklySelectedDay} />
      <Stack.Screen name="MonthlyCustomReminder" component={CustomMonthlyReminder} />
      <Stack.Screen name="MonthlyMultipleMonth" component={MultipleMonth} />
      <Stack.Screen name="OnceMonthReminder" component={OnceMonthReminder} />
      <Stack.Screen name="MonthlyOccurence" component={MonthlyOccurence} />
      <Stack.Screen name="MonthlyOccurrenceTwo" component={MonthlyOccurrenceTwo} />
      <Stack.Screen name="MultipleDateMonth" component={MultipleDateMonth} />
      <Stack.Screen name="YearlyReminder" component={YearlyReminder} />
      <Stack.Screen name="YearlyReminderTwo" component={YearlyReminderTwo} />
      <Stack.Screen name="YearlyAll" component={YearlyAll} />
      <Stack.Screen name="YearlyAllTwo" component={YearlyAllTwo} />
      <Stack.Screen name="ReminderList" component={ReminderList} />
      <Stack.Screen name="Allreminderlist" component={AllReminderList} />
      <Stack.Screen name="AlarmScreen" component={AlarmScreen}  />
      <Stack.Screen name="Single" component={SingleReminder}  />
      <Stack.Screen name="DataYear" component={DataYear}  />






    </Stack.Navigator>
  );
};

const App = () => {
  return (
    <ReminderProvider>

    <NavigationContainer>
      <MainScreen />
    </NavigationContainer>
    </ReminderProvider>

  );
};

export default App;
