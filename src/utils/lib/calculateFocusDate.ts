import { CalendarProps } from '@react-date-range/types';
import { startOfMonth, endOfMonth, differenceInCalendarMonths } from 'date-fns';

type Config = Pick<
  CalendarProps,
  'shownDate' | 'date' | 'months' | 'ranges' | 'focusedRange' | 'displayMode'
>;

type TargetInterval = {
  start?: Date;
  end?: Date;
};

export function calculateFocusDate(
  currentFocusedDate: Date | null,
  config: Config
) {
  const { shownDate, date, months, ranges, focusedRange, displayMode } = config;

  // Find primary date according the config
  let targetInterval: TargetInterval;
  if (displayMode === 'dateRange') {
    const selectedRange = ranges && focusedRange ? ranges[focusedRange[0]] : {};

    targetInterval = {
      start: selectedRange.startDate,
      end: selectedRange.endDate,
    };
  } else {
    targetInterval = {
      start: date,
      end: date,
    };
  }

  targetInterval.start = startOfMonth(targetInterval.start || new Date());
  targetInterval.end = endOfMonth(targetInterval.end || targetInterval.start);
  const targetDate = targetInterval.start || shownDate || new Date();

  // initial focus
  if (!currentFocusedDate) {
    return shownDate || targetDate;
  }

  // // just return targetDate for native scrolled calendars
  // if (config.scroll.enabled) return targetDate;
  if (
    months &&
    differenceInCalendarMonths(targetInterval.start, targetInterval.end) >
      months
  ) {
    // don't change focused if new selection in view area
    return currentFocusedDate;
  }

  return targetDate;
}
