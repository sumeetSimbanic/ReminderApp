import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import TimeRangeReminder from "./src/components/Daily/TimeRangeReminder";
import MultipleTimeReminder from "./src/components/Daily/MultipleTimeReminder";


//import MultipleReminderScreen from "./src/components/MultipleReminderScreen";

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false, // Hide the header for all screens
        }}
      >
<Stack.Screen
  name="Reminder"
  component={MultipleTimeReminder}
/>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
