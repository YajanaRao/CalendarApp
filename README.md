# How to crate a Calendar App in React Native without External Libraries

We are going to create a calendar application without using any external libraries just using Typescript.

![CalendarApp.gif](./assets/CalendarApp.gif)

Pre requisite: Make sure to have a [react native development environment](https://reactnative.dev/docs/environment-setup).

Let's start by creating a react native application

```jsx
npx react-native init CalendarApp --template react-native-template-typescript

cd CalendarApp
```

Let's start by creating a `const.ts` file for storing all the constants related to Calendar component

```jsx
// src/components/Calendar/consts.ts
export const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export const daysInEachMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
```

We need to create a two dimensional array containing days and date in the calendar format. For that let's create a function called `generateMatrix` which handles this logic.

```jsx
// src/components/Calender/utils
import { weekDays, daysInEachMonth } from "./const";

export function generateMatrix(currentDate: Date) {
  let matrix: (number | string)[][] = [];

  // Create header of days
  matrix[0] = weekDays;

  let year = currentDate.getFullYear();
  let month = currentDate.getMonth();

  // The getDay() method returns the day of the week (from 0 to 6) for the specified date. Sunday is 0, Monday is 1, and so on.
  let firstDay = new Date(year, month, 1).getDay();

  // based on number of days in each month
  let maxDays = daysInEachMonth[month];
  if (month == 1) {
    // checking leap year in February

    /*
    To check if a year is a leap year, divide the year by 4. If it is fully divisible by 4, it is a leap year. For example, the year 2016 is divisible 4, so it is a leap year, whereas, 2015 is not.

    However, Century years like 300, 700, 1900, 2000 need to be divided by 400 to check whether they are leap years or not.
    */
    if ((year % 4 == 0 && year % 100 != 0) || year % 400 == 0) {
      maxDays += 1;
    }
  }

  let counter = 1;
  for (let row = 1; row < 7; row++) {
    matrix[row] = [];
    for (let col = 0; col < 7; col++) {
      matrix[row][col] = -1;

      if (row == 1 && col >= firstDay) {
        // in first row the date should start from the from day of the week
        matrix[row][col] = counter++;
      } else if (row > 1 && counter <= maxDays) {
        matrix[row][col] = counter++;
      }
    }
  }

  return matrix;
}
```

Let's create a Calendar component called `Calendar.tsx` Inside the `src/compoents/Calender` folder

The calender component will take `current` props to show the active date visible in the calendar component

```jsx
// src/components/Calendar/Calendar.tsx
import * as React from "react";
import { View, Text, Button, TouchableOpacity, StyleSheet } from "react-native";
import { DefaultTheme } from "../../theme";
import { months } from "./const";
import { generateMatrix } from "./utils";

function Calendar({ current = new Date() }: { current: Date }) {
  const [activeDate, setActiveDate] = React.useState(current);

  React.useEffect(() => {
    if (activeDate != current) {
      setActiveDate(current);
    }
  }, [current]);

  const _onPress = (item: number) => {
    if (typeof item !== "string" && item != -1) {
      const newDate = new Date(activeDate.setDate(item));
      setActiveDate(newDate);
    }
  };

  const matrix = generateMatrix(activeDate);

  let rows = [];

  rows = matrix.map((row, rowIndex: number) => {
    let rowItems = row.map((item: any, colIndex: number) => {
      return (
        <TouchableOpacity
          key={colIndex}
          onPress={() => _onPress(item)}
          style={[
            styles.date,
            item == activeDate.getDate()
              ? styles.activeDate
              : styles.inActiveDate,
          ]}
        >
          <Text
            style={[
              styles.dateText,
              {
                color: colIndex == 0 ? DefaultTheme.error : DefaultTheme.text,
                fontWeight: item == activeDate.getDate() ? "bold" : "normal",
              },
            ]}
          >
            {item != -1 ? item : ""}
          </Text>
        </TouchableOpacity>
      );
    });

    return (
      <View key={rowIndex} style={styles.rowContainer}>
        {rowItems}
      </View>
    );
  });

  const changeMonth = (n: number) => {
    const newDate = new Date(activeDate.setMonth(activeDate.getMonth() + n));
    setActiveDate(newDate);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.currentDate}>
        {`${months[activeDate.getMonth()]} ${activeDate.getFullYear()}`}
      </Text>
      <View>{rows}</View>
      <View style={styles.actionContainer}>
        <View style={styles.buttonContainer}>
          <Button
            title="Previous"
            color={DefaultTheme.primary}
            onPress={() => changeMonth(-1)}
          />
        </View>
        <View style={styles.buttonContainer}>
          <Button
            title="Next"
            color={DefaultTheme.primary}
            onPress={() => changeMonth(+1)}
          />
        </View>
      </View>
    </View>
  );
}

export default Calendar;

const styles = StyleSheet.create({
  container: { padding: 12 },
  rowContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  date: {
    height: 40,
    width: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  activeDate: { backgroundColor: DefaultTheme.primary, borderRadius: 20 },
  inActiveDate: { backgroundColor: "#fff" },
  dateText: {
    textAlign: "center",
    fontSize: 14,
  },
  actionContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    flex: 1,
    marginTop: 8,
  },
  buttonContainer: { flex: 1, marginHorizontal: 2 },
  currentDate: { fontWeight: "600", fontSize: 28, textAlign: "center" },
});
```

Let's import the component in `App.tsx` and implement functionalities like jump to the date in the file:

```jsx
// App.tsx

import * as React from 'react';
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  Button,
  ScrollView,
  StatusBar,
  SafeAreaView,
} from 'react-native';

import { DefaultTheme } from './src/theme';
import Calendar from './src/components/Calendar';

export default function App() {
  const [value, setValue] = React.useState(new Date());
  const [day, setDay] = React.useState<number>();
  const [month, setMonth] = React.useState<number>();
  const [year, setYear] = React.useState<number>();

  function jumpToDate() {
    const newDate = new Date(year, month - 1, day, 0, 0, 0, 0);
    setValue(newDate);
  }

  function onDayChange(newDate) {
    if (newDate <= 31) {
      setDay(newDate);
    }
  }

  function onMonthChange(newMonth) {
    if (newMonth <= 12) {
      setMonth(newMonth);
    }
  }

  function onYearChange(newYear) {
    setYear(newYear);
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView style={styles.container}>
        <View style={styles.center}>
          <View style={styles.card}>
            <Calendar current={value} />
          </View>
          <View style={[styles.card, styles.jumpToDateCard]}>
            <Text style={styles.title}>Jump to the date</Text>
            <View style={styles.row}>
              <View style={styles.col}>
                {/*
                for performance optimization the value has been commented
                https://callstack.com/data/The_Ultimate_Guide_to_React_Native_Optimization_Ebook-Callstack_FINAL.pdf
              */}
                <TextInput
                  // value={day}
                  placeholder="DD"
                  maxLength={2}
                  onChangeText={onDayChange}
                  style={styles.textinput}
                  keyboardType="number-pad"
                />
              </View>
              <View style={styles.col}>
                <TextInput
                  // value={month}
                  placeholder="MM"
                  maxLength={2}
                  onChangeText={onMonthChange}
                  style={styles.textinput}
                  keyboardType="number-pad"
                />
              </View>
              <View style={styles.col}>
                <TextInput
                  // value={year}
                  placeholder="YYYY"
                  maxLength={4}
                  onChangeText={onYearChange}
                  style={styles.textinput}
                  keyboardType="number-pad"
                />
              </View>
            </View>
            <View style={styles.goButton}>
              <Button
                title="go"
                disabled={!day || !month || !year}
                onPress={jumpToDate}
                color={DefaultTheme.primary}
              />
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: DefaultTheme.background,
    padding: 8,
    marginTop: StatusBar.currentHeight,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignContent: 'center',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
  },
  jumpToDateCard: {
    marginTop: 12,
    padding: 12,
  },
  textinput: {
    marginVertical: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: DefaultTheme.border,
    textAlign: 'center',
    borderRadius: 8,
  },
  goButton: { padding: 4 },
  title: {
    fontWeight: '700',
    fontSize: 16,
    textAlign: 'center',
  },
  col: { flex: 1, margin: 4 },
  row: { flexDirection: 'row', flex: 1 },
});
```

## References:

Link to the Snack: [https://snack.expo.dev/@yajana/calendarapp](https://snack.expo.dev/@yajana/calendarapp)

Link to the GitHub repo: [https://github.com/YajanaRao/CalendarApp](https://github.com/YajanaRao/CalendarApp)
