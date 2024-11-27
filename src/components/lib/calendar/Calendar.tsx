import {
  CalendarProps,
  DateOptions,
  Drag,
  Preview,
  Styles,
} from '@react-date-range/types';
import { FC, useCallback, useRef, useState } from 'react';
import { enUS } from '@react-date-range/locale';
import {
  addDays,
  addMonths,
  addYears,
  differenceInCalendarMonths,
  differenceInDays,
  endOfMonth,
  isSameDay,
  isSameMonth,
  startOfMonth,
  subMonths,
} from 'date-fns';
import {
  calculateFocusDate,
  generateStyles,
  getMonthDisplayRange,
} from '@react-date-range/utils';
import { coreStyles } from '@react-date-range/styles';
import classnames from 'classnames';
import { DateDisplay } from './DateDisplay';
import { MonthAndYear } from './MonthAndYear';
import { WeekDays } from '../shared/WeekDays';
import { VirtualizedList } from '../shared/VirtualizedList';
import './calendar.scss';
import { Month } from '../month/Month';

const DEFAULT_MAX_DATE = addYears(new Date(), 20);
const DEFAULT_MIN_DATE = addYears(new Date(), -100);

const calculateScrollArea = (
  direction: CalendarProps['direction'],
  months: CalendarProps['months'] = 1,
  scroll: CalendarProps['scroll']
) => {
  if (!scroll?.enabled) {
    return { enabled: false };
  }

  const longMonthHeight = scroll.longMonthHeight || scroll.monthHeight;
  if (direction === 'vertical') {
    return {
      enabled: true,
      monthHeight: scroll.monthHeight || 220,
      longMonthHeight: longMonthHeight || 260,
      calendarWidth: 'auto',
      calendarHeight:
        (scroll.calendarHeight || longMonthHeight || 240) * months,
    };
  }
  return {
    enabled: true,
    monthWidth: scroll.monthWidth || 332,
    calendarWidth: (scroll.calendarWidth || scroll.monthWidth || 332) * months,
    monthHeight: longMonthHeight || 300,
    calendarHeight: longMonthHeight || 300,
  };
};

export const Calendar: FC<CalendarProps> = ({
  date,
  shownDate,
  showMonthArrow = true,
  showMonthAndYearPickers = true,
  disabledDates = [],
  disabledDay,
  classNames = {},
  locale = enUS,
  ranges = [],
  focusedRange = [0, 0],
  dateDisplayFormat = 'MMM d, yyyy',
  monthDisplayFormat = 'MMM yyyy',
  weekdayDisplayFormat = 'E',
  dayDisplayFormat = 'd',
  showDateDisplay = true,
  showPreview = true,
  displayMode = 'date',
  months = 1,
  color = '#3d91ff',
  scroll = {
    enabled: false,
  },
  direction = 'vertical',
  maxDate = addYears(new Date(), 20),
  minDate = addYears(new Date(), -100),
  rangeColors = ['#3d91ff', '#3ecf8e', '#fed14c'],
  startDatePlaceholder = 'Early',
  endDatePlaceholder = 'Continuous',
  editableDateInputs = false,
  dragSelectionEnabled = true,
  fixedHeight = false,
  calendarFocus = 'forwards',
  preventSnapRefocus = false,
  ariaLabels = {},
  onShownDateChange,
  onRangeFocusChange,
  onChange,
  updateRange,
  className,
  onPreviewChange,
  ...rest
}) => {
  // TODO: Check if refs should be computed values
  const stylesRef = useRef<Styles>(generateStyles([coreStyles, classNames]));
  const dateOptionsRef = useRef<DateOptions>({ locale: locale });
  const listSizeCacheRef = useRef<object>({});

  const [preview, setPreview] = useState<Preview>();
  const [drag, setDrag] = useState<Drag>({
    status: false,
    range: { startDate: null, endDate: null },
    disablePreview: false,
  });
  const [focusedDate, setFocusedDate] = useState(() =>
    calculateFocusDate(null, {
      date,
      displayMode,
      focusedRange,
      months,
      ranges,
      shownDate,
    })
  );

  const [scrollArea, setScrollArea] = useState(() =>
    calculateScrollArea(direction, months, scroll)
  );

  const focusToDate = useCallback(
    (date: Date, preventUnnecessary = true) => {
      if (!scroll?.enabled) {
        if (preventUnnecessary && preventSnapRefocus) {
          const focusedDateDiff = differenceInCalendarMonths(date, focusedDate);
          const isAllowedForward =
            calendarFocus === 'forwards' && focusedDateDiff >= 0;
          const isAllowedBackward =
            calendarFocus === 'backwards' && focusedDateDiff <= 0;
          if (
            (isAllowedForward || isAllowedBackward) &&
            Math.abs(focusedDateDiff) < months
          ) {
            return;
          }
        }
        setFocusedDate(date);
        return;
      }
      const targetMonthIndex = differenceInCalendarMonths(date, minDate);
      //   TODO: Implement (see if to use react-list as in the library or custom implementation)
      //   const visibleMonths = this.list.getVisibleRange();
      //   if (preventUnnecessary && visibleMonths.includes(targetMonthIndex)) {
      //     return;
      //   }

      // TODO: Check what it's used for
      //   this.isFirstRender = true;
      // TODO: List implementation needed
      //   this.list.scrollTo(targetMonthIndex);
      setFocusedDate(date);
    },
    [
      calendarFocus,
      focusedDate,
      minDate,
      months,
      preventSnapRefocus,
      scroll?.enabled,
    ]
  );

  const updateShownDate = useCallback(() => {
    const newMonths = scroll?.enabled
      ? this.list.getVisibleRange().length
      : undefined;

    const newFocus = calculateFocusDate(focusedDate, {
      date,
      displayMode,
      focusedRange,
      months: newMonths ? newMonths : months,
      ranges,
      shownDate,
    });
    focusToDate(newFocus);
  }, [
    date,
    displayMode,
    focusToDate,
    focusedDate,
    focusedRange,
    months,
    ranges,
    scroll?.enabled,
    shownDate,
  ]);

  const updatePreview = useCallback(
    (val?: Date | null) => {
      if (!val) {
        setPreview(undefined);
        return;
      }

      setPreview({
        startDate: val,
        endDate: val,
        color,
      });
    },
    [color]
  );

  const handleRangeFocusChange = useCallback(
    (rangesIndex: number, rangeItemIndex: 0 | 1) => {
      onRangeFocusChange?.([rangesIndex, rangeItemIndex]);
    },
    [onRangeFocusChange]
  );

  const handleScroll = useCallback(() => {
    // TODO: Check list
    const visibleMonths = this.list.getVisibleRange();
    // prevent scroll jump with wrong visible value
    if (visibleMonths[0] === undefined) return;
    const visibleMonth = addMonths(minDate, visibleMonths[0] || 0);
    const isFocusedToDifferent = !isSameMonth(visibleMonth, focusedDate);
    // TODO: Check isFirstRender
    if (isFocusedToDifferent && !isFirstRender) {
      setFocusedDate(visibleMonth);
      onShownDateChange?.(visibleMonth);
    }
    // this.isFirstRender = false;
  }, [focusedDate, minDate, onShownDateChange]);

  const onDragSelectionStart = useCallback(
    (date: Date) => {
      if (dragSelectionEnabled) {
        setDrag({
          range: { startDate: date, endDate: date },
          status: true,
          disablePreview: true,
        });
      } else {
        onChange?.(date);
      }
    },
    [dragSelectionEnabled, onChange]
  );

  const onDragSelectionEnd = useCallback(
    (date: Date) => {
      if (!dragSelectionEnabled) {
        return;
      }

      if (displayMode === 'date' || drag.status) {
        onChange?.(date);
        return;
      }

      const newRange = {
        startDate: drag.range.startDate,
        endDate: date,
      };

      if (
        displayMode !== 'dateRange' ||
        (newRange.startDate && isSameDay(newRange.startDate, date))
      ) {
        setDrag((prev) => ({ ...prev, status: false, range: {} }));
        onChange?.(date);
      } else {
        setDrag((prev) => ({ ...prev, status: false, range: {} }));
        updateRange?.({
          startDate: newRange.startDate || undefined,
          endDate: newRange.endDate,
        });
      }
    },
    [
      displayMode,
      drag.range.startDate,
      drag.status,
      dragSelectionEnabled,
      onChange,
      updateRange,
    ]
  );

  const onDragSelectionMove = useCallback(
    (date: Date) => {
      if (!drag.status || !dragSelectionEnabled) {
        return;
      }

      setDrag({
        status: drag.status,
        range: { startDate: drag.range.startDate, endDate: date },
        disablePreview: true,
      });
    },
    [drag.range.startDate, drag.status, dragSelectionEnabled]
  );

  //   TODO: Check this is needed
  //   const estimateMonthSize = useCallback(
  //     (index: number, cache: object) => {
  //       if (cache) {
  //         listSizeCacheRef.current = cache;
  //         if (cache[index]) {
  //           return cache[index];
  //         }
  //       }
  //       if (direction === 'horizontal') return scrollArea.monthWidth;
  //       const monthStep = addMonths(minDate, index);
  //       const { start, end } = getMonthDisplayRange(monthStep, this.dateOptions);
  //       const isLongMonth =
  //         differenceInDays(end, start, dateOptionsRef.current) + 1 > 7 * 5;
  //       return isLongMonth ? scrollArea.longMonthHeight : scrollArea.monthHeight;
  //     },
  //     [
  //       direction,
  //       minDate,
  //       scrollArea.longMonthHeight,
  //       scrollArea.monthHeight,
  //       scrollArea.monthWidth,
  //     ]
  //   );

  const isVertical = direction === 'vertical';

  return (
    <div
      className={classnames(stylesRef.current.calendarWrapper, className)}
      onMouseUp={() =>
        setDrag((prev) => ({ ...prev, status: false, range: {} }))
      }
      onMouseLeave={() => {
        setDrag((prev) => ({ ...prev, status: false, range: {} }));
      }}
    >
      {showDateDisplay ? (
        <DateDisplay
          focusedRange={focusedRange}
          dateOptions={dateOptionsRef.current}
          styles={stylesRef.current}
          ranges={ranges}
          rangeColors={rangeColors}
          ariaLabels={ariaLabels}
          editableDateInputs={editableDateInputs}
          startDatePlaceholder={startDatePlaceholder}
          endDatePlaceholder={endDatePlaceholder}
          dateDisplayFormat={dateDisplayFormat}
          onStartDateFocus={(index) => handleRangeFocusChange(index, 0)}
          onEndDateFocus={(index) => handleRangeFocusChange(index, 1)}
          onDateInputChange={onDragSelectionEnd}
        />
      ) : null}
      <MonthAndYear
        maxDate={maxDate || DEFAULT_MAX_DATE}
        minDate={minDate || DEFAULT_MIN_DATE}
        showMonthArrow={showMonthArrow}
        styles={stylesRef.current}
        ariaLabels={ariaLabels}
        showMonthAndYearPickers={showMonthAndYearPickers}
        locale={locale}
        focusedDate={focusedDate}
        onDateChange={(newDate) => {
          focusToDate(newDate, false);
          onShownDateChange?.(newDate);
        }}
      />
      {scroll.enabled ? (
        <div>
          {isVertical ? (
            <WeekDays
              dateOptions={dateOptionsRef.current}
              styles={stylesRef.current}
              weekdayDisplayFormat={weekdayDisplayFormat}
            />
          ) : null}
          <div
            className={classnames(
              stylesRef.current.infiniteMonths,
              isVertical
                ? stylesRef.current.monthsVertical
                : stylesRef.current.monthsHorizontal
            )}
            onMouseLeave={() => onPreviewChange?.()}
            style={{
              width: (Number(scrollArea.calendarWidth) || 0) + 11,
              height: (Number(scrollArea.calendarHeight) || 0) + 11,
            }}
            onScroll={handleScroll}
          >
            <VirtualizedList
              length={differenceInCalendarMonths(
                endOfMonth(maxDate),
                addDays(startOfMonth(minDate), -1)
                // dateOptionsRef.current TODO: Check what to do
              )}
              overscan={500}
              orientation={isVertical ? 'vertical' : 'horizontal'}
              itemRenderer={(index, key) => {
                const monthStep = addMonths(minDate, index);
                return (
                  <Month
                    {...rest} // TODO: Check when to remove
                    monthDisplayFormat={monthDisplayFormat}
                    weekdayDisplayFormat={weekdayDisplayFormat}
                    dayDisplayFormat={dayDisplayFormat}
                    onPreviewChange={onPreviewChange || updatePreview}
                    preview={preview}
                    ranges={ranges}
                    key={key}
                    drag={drag}
                    dateOptions={dateOptionsRef.current}
                    disabledDates={disabledDates}
                    disabledDay={disabledDay}
                    month={monthStep}
                    onDragSelectionStart={onDragSelectionStart}
                    onDragSelectionEnd={onDragSelectionEnd}
                    onDragSelectionMove={onDragSelectionMove}
                    onMouseLeave={() => onPreviewChange?.()}
                    styles={stylesRef.current}
                    // style={
                    //   isVertical
                    //     ? { height: estimateMonthSize(index) }
                    //     : {
                    //         height: scrollArea.monthHeight,
                    //         width: estimateMonthSize(index),
                    //       }
                    // }
                    showMonthName
                    showWeekDays={!isVertical}
                  />
                );
              }}
            />
          </div>
        </div>
      ) : (
        <div
          className={classnames(
            stylesRef.current.months,
            isVertical
              ? stylesRef.current.monthsVertical
              : stylesRef.current.monthsHorizontal
          )}
        >
          {new Array(months).fill(null).map((_, i) => {
            let monthStep = addMonths(focusedDate, i);
            if (calendarFocus === 'backwards') {
              monthStep = subMonths(focusedDate, months - 1 - i);
            }

            return (
              <Month
                {...rest} // TODO: Check when to remove
                key={monthStep.toISOString()}
                monthDisplayFormat={monthDisplayFormat}
                weekdayDisplayFormat={weekdayDisplayFormat}
                dayDisplayFormat={dayDisplayFormat}
                onPreviewChange={onPreviewChange || updatePreview}
                preview={preview}
                ranges={ranges}
                drag={drag}
                dateOptions={dateOptionsRef.current}
                disabledDates={disabledDates}
                disabledDay={disabledDay}
                month={monthStep}
                onDragSelectionStart={onDragSelectionStart}
                onDragSelectionEnd={onDragSelectionEnd}
                onDragSelectionMove={onDragSelectionMove}
                onMouseLeave={() => onPreviewChange?.()}
                styles={stylesRef.current}
                // style={
                //   isVertical
                //     ? { height: estimateMonthSize(index) }
                //     : {
                //         height: scrollArea.monthHeight,
                //         width: estimateMonthSize(index),
                //       }
                // }
                showMonthName={!isVertical || i > 0}
                showWeekDays={!isVertical || i === 0}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};
