import * as React from 'react';
import {
  View,
  Text,
  Button,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { DefaultTheme } from '../../theme';
import { months } from './const';
import { generateMatrix } from './utils';

function Calendar({ date = new Date() }: { date: Date }) {
  const [activeDate, setActiveDate] = React.useState(date);

  React.useEffect(() => {
    if (activeDate != date) {
      setActiveDate(date);
    }
  }, [date]);

  const _onPress = (item: number) => {
    if (typeof item !== 'string' && item != -1) {
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
          ]}>
          <Text
            style={[styles.dateText, {
              color: colIndex == 0 ? DefaultTheme.error : DefaultTheme.text,
              fontWeight: item == activeDate.getDate() ? 'bold' : 'normal',
            }]}>
            {item != -1 ? item : ''}
          </Text>
        </TouchableOpacity>
      );
    });

    return <View key={rowIndex} style={styles.rowContainer}>{rowItems}</View>;
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
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  date: {
    height: 40,
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeDate: { backgroundColor: DefaultTheme.primary, borderRadius: 20 },
  inActiveDate: { backgroundColor: '#fff' },
  dateText: {
    textAlign: 'center',
    fontSize: 14
  },
  actionContainer: { flexDirection: 'row', justifyContent: 'space-around', flex: 1, marginTop: 8 },
  buttonContainer: { flex: 1, marginHorizontal: 2 },
  currentDate: { fontWeight: '600', fontSize: 28, textAlign: 'center' },
});
