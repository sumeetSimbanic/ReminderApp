import React from "react";
import { View, Button, StyleSheet } from "react-native";

const OptionScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
            <Button title="Single Reminder" onPress={() => navigation.navigate("Single")}/>

      <Button style={styles.buttonContainer} title="Hourly Reminder" onPress={() => navigation.navigate("Hourly")} />
      <Button title="Hourly Multiple Time Reminder" onPress={() => navigation.navigate("HourlyMultiple")} />
      <Button title="Daily Date Range Reminder" onPress={() => navigation.navigate("DailyDateRangeReminder")} />
      <Button title="Daily Multiple Time Reminder" onPress={() => navigation.navigate("DailyMultipleTimeReminder")} />
      <Button title="Daily Time Range Reminder" onPress={() => navigation.navigate("DailyTimerangeReminder")} />
      <Button title="Weekly Duration 2" onPress={() => navigation.navigate("WeeklyDuration")} />
      <Button title="Weekly Duration Time" onPress={() => navigation.navigate("WeeklyDurationTime")} />
      {/* <Button title="Weekly Selected Day" onPress={() => navigation.navigate("WeeklySelectedDay")} /> */}
      {/* <Button title="Monthly Custom Reminder" onPress={() => navigation.navigate("MonthlyCustomReminder")} /> */}
      {/* <Button title="Monthly Multiple Month" onPress={() => navigation.navigate("MonthlyMultipleMonth")} /> */}
      {/* Uncomment the lines below when you have those components */}
      {/* <Button title="Yearly Reminder" onPress={() => navigation.navigate("YearlyReminder")} /> */}
      {/* <Button title="Yearly Reminder Two" onPress={() => navigation.navigate("YearlyReminderTwo")} /> */}
      <Button title="Montly Occurence" onPress={() => navigation.navigate("MonthlyOccurence")} />
      <Button title="Montly Occurence Two" onPress={() => navigation.navigate("MonthlyOccurrenceTwo")} />

      <Button title="Once a Month" onPress={() => navigation.navigate("OnceMonthReminder")} />
      <Button title="Multiple Date In A Month" onPress={() => navigation.navigate("MultipleDateMonth")}/>


      {/* <Button title="Yearly All" onPress={() => navigation.navigate("YearlyAll")} /> */}

      <Button title="Yearly All" onPress={() => navigation.navigate("YearlyAll")} />
      <Button title="Yearly All Two" onPress={() => navigation.navigate("YearlyAllTwo")}/>

      <Button title="ALL REMINDER" onPress={() => navigation.navigate("Allreminderlist")}/>
      {/* <Button title="ALARM" onPress={() => navigation.navigate("Alarm")}/> */}
      <Button title="YearlyaData" onPress={() => navigation.navigate("DataYear")}/>


    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonContainer:{
    margin:10
  }
});

export default OptionScreen;
