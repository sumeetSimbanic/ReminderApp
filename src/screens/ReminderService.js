// ReminderService.js

import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase({ name: 'mydatabase.db', location: 'default' });

const createTable = () => {
  db.transaction((tx) => {
    tx.executeSql(
      'CREATE TABLE IF NOT EXISTS reminders (interval TEXT, duration TEXT, months TEXT, date TEXT, time TEXT, year INTEGER)',
      [],
      (tx, results) => {
        console.log('Table created successfully');
      },
      (error) => {
        console.error('Error creating table: ', error);
      }
    );
  });
};

const getTableFields = (tableName) => {
  db.transaction((tx) => {
    tx.executeSql(
      `PRAGMA table_info(${tableName})`,
      [],
      (_, { rows }) => {
        const fields = rows._array.map((row) => row.name);
        console.log('Table Fields:', fields);
      },
      (_, error) => {
        console.error('Error getting table fields: ', error);
      }
    );
  });
};

const addReminderToDatabase = (reminder) => {
  db.transaction((tx) => {
    tx.executeSql(
      'INSERT INTO reminders (interval, duration, months, date, time, year) VALUES (?, ?, ?, ?, ?, ?)',
      [reminder.interval, reminder.duration, reminder.months.join(', '), reminder.date, reminder.time, reminder.year],
      (tx, results) => {
        console.log('Reminder inserted successfully');
      },
      (error) => {
        console.error('Error inserting reminder: ', error);
      }
    );
  });
};

const retrieveRemindersFromDatabase = (setDatabaseData) => {
  db.transaction((tx) => {
    tx.executeSql(
      'SELECT * FROM reminders',
      [],
      (_, { rows }) => {
        const reminders = rows._array;
        setDatabaseData(reminders); // Set the retrieved data to state
      },
      (_, error) => {
        console.error('Error retrieving reminders from the database', error);
      }
    );
  });
};

export { createTable, getTableFields, addReminderToDatabase, retrieveRemindersFromDatabase };
