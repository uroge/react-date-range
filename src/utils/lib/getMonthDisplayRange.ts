import {
  addDays,
  ContextOptions,
  differenceInCalendarDays,
  endOfMonth,
  endOfWeek,
  startOfMonth,
  startOfWeek,
} from 'date-fns';

export function getMonthDisplayRange(
  date: Date,
  dateOptions: ContextOptions<Date>,
  fixedHeight: boolean
) {
  const startDateOfMonth = startOfMonth(date, dateOptions);
  const endDateOfMonth = endOfMonth(date, dateOptions);
  const startDateOfCalendar = startOfWeek(startDateOfMonth, dateOptions);
  let endDateOfCalendar = endOfWeek(endDateOfMonth, dateOptions);
  if (
    fixedHeight &&
    differenceInCalendarDays(endDateOfCalendar, startDateOfCalendar) <= 34
  ) {
    endDateOfCalendar = addDays(endDateOfCalendar, 7);
  }
  return {
    start: startDateOfCalendar,
    end: endDateOfCalendar,
    startDateOfMonth,
    endDateOfMonth,
  };
}
