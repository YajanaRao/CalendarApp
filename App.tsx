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
            <Calendar
              // Initially visible day, week, month and year. Default = Date()
              current={value}
            />
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
