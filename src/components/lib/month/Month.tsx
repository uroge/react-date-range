import { MonthProps } from '@react-date-range/types';
import { getMonthDisplayRange } from '@react-date-range/utils';
import {
  eachDayOfInterval,
  endOfDay,
  endOfWeek,
  format,
  isAfter,
  isBefore,
  isSameDay,
  isWeekend,
  isWithinInterval,
  startOfDay,
  startOfWeek,
} from 'date-fns';
import { FC } from 'react';
import { WeekDays } from '../shared/WeekDays';
import { DayCell } from '../shared/DayCell';

export const Month: FC<MonthProps> = ({
  dateOptions,
  minDate: minDateProp,
  maxDate: maxDateProp,
  month,
  fixedHeight,
  ranges: rangesProp,
  displayMode,
  drag,
  focusedRange,
  showPreview,
  styles,
  style,
  showMonthName,
  monthDisplayFormat,
  showWeekDays,
  weekdayDisplayFormat,
  disabledDates,
  preview,
  onMouseLeave,
  disabledDay,
  onDragSelectionStart,
  onDragSelectionEnd,
  onDragSelectionMove,
  onPreviewChange,
}) => {
  const now = new Date();
  const minDate = minDateProp && startOfDay(minDateProp);
  const maxDate = maxDateProp && endOfDay(maxDateProp);

  const monthDisplay =
    month && getMonthDisplayRange(month, dateOptions, fixedHeight);

  let ranges = rangesProp;
  if (displayMode === 'dateRange' && drag.status) {
    const { startDate, endDate } = drag.range;
    ranges = rangesProp?.map((range, i) => {
      if (i !== focusedRange?.[0]) {
        return range;
      }
      return {
        ...range,
        startDate: startDate ?? undefined,
        endDate: endDate ?? undefined,
      };
    });
  }

  const shouldShowPreview = showPreview && !drag?.disablePreview;

  return (
    <div className={styles?.month} style={style}>
      {showMonthName ? (
        <div className={styles?.monthName}>
          {format(month, monthDisplayFormat, dateOptions)}
        </div>
      ) : null}
      {showWeekDays && (
        <WeekDays
          dateOptions={dateOptions}
          styles={styles}
          weekdayDisplayFormat={weekdayDisplayFormat}
        />
      )}
      <div className={styles?.days} onMouseLeave={onMouseLeave}>
        {eachDayOfInterval({
          start: monthDisplay.start,
          end: monthDisplay.end,
        }).map((day) => {
          const isStartOfMonth = isSameDay(day, monthDisplay.startDateOfMonth);
          const isEndOfMonth = isSameDay(day, monthDisplay.endDateOfMonth);
          const isOutsideMinMax =
            (minDate && isBefore(day, minDate)) ||
            (maxDate && isAfter(day, maxDate));
          const isDisabledSpecifically = disabledDates?.some((disabledDate) =>
            isSameDay(disabledDate, day)
          );
          const isDisabledDay = disabledDay?.(day);
          return (
            <DayCell
              key={day.toISOString()}
              onPreviewChange={onPreviewChange}
              ranges={ranges}
              day={day}
              preview={shouldShowPreview ? preview : undefined}
              isWeekend={isWeekend(day, dateOptions)}
              isToday={isSameDay(day, now)}
              isStartOfWeek={isSameDay(day, startOfWeek(day, dateOptions))}
              isEndOfWeek={isSameDay(day, endOfWeek(day, dateOptions))}
              isStartOfMonth={isStartOfMonth}
              isEndOfMonth={isEndOfMonth}
              disabled={
                isOutsideMinMax || isDisabledSpecifically || isDisabledDay
              }
              isPassive={
                !isWithinInterval(day, {
                  start: monthDisplay.startDateOfMonth,
                  end: monthDisplay.endDateOfMonth,
                })
              }
              styles={styles}
              onMouseDown={onDragSelectionStart}
              onMouseUp={onDragSelectionEnd}
              onMouseEnter={onDragSelectionMove}
            />
          );
        })}
      </div>
    </div>
  );
};
