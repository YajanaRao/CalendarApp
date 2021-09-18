import { weekDays, daysInEachMonth } from './const';

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
