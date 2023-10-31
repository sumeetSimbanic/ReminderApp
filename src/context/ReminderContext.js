// ReminderContext.js
import React, { createContext, useContext, useReducer } from 'react';

// Create a context
export const ReminderContext = createContext();

// Initial state for the reminders
const initialState = [];

// Reducer function to handle reminders
function reminderReducer(state, action) {
  switch (action.type) {
    case 'ADD_REMINDER':
      return [...state, action.payload];
    case 'DELETE_REMINDER':
      return state.filter((_, index) => index !== action.payload);
    default:
      return state;
  }
}

// ReminderProvider component
export const ReminderProvider = ({ children }) => {
  const [reminders, dispatch] = useReducer(reminderReducer, initialState);

  return (
    <ReminderContext.Provider value={{ reminders, dispatch }}>
      {children}
    </ReminderContext.Provider>
  );
};

// Custom hook to use the reminder context
export const useReminder = () => {
  return useContext(ReminderContext);
};
