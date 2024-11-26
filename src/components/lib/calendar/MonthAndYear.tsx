import { ChangeEvent, FC, useCallback, useMemo } from 'react';
import { AriaLabelsShape, ShownDateMode } from '@react-date-range/types';
import classnames from 'classnames';
import {
  addMonths,
  DateArg,
  Locale,
  max,
  min,
  Month,
  setMonth,
  setYear,
} from 'date-fns';

type MonthAndYearProps = {
  maxDate: Date;
  minDate: Date;
  styles: Record<string, string>;
  showMonthArrow: boolean;
  ariaLabels: AriaLabelsShape;
  showMonthAndYearPickers?: boolean;
  locale: Locale;
  focusedDate: Date;
  onDateChange: (newDate: Date) => void;
};

export const MonthAndYear: FC<MonthAndYearProps> = ({
  maxDate,
  minDate,
  styles,
  showMonthArrow,
  ariaLabels,
  showMonthAndYearPickers,
  locale,
  focusedDate,
  onDateChange,
}) => {
  const upperYearLimit = maxDate.getFullYear();
  const lowerYearLimit = minDate.getFullYear();
  const monthNames = useMemo(() => {
    return [...Array(12).keys()].map(
      (i) => locale.localize.month(i as Month) ?? i
    );
  }, [locale.localize]);

  const changeShownDate = useCallback(
    (value: number, mode: ShownDateMode = 'set') => {
      const modeMapper: Record<ShownDateMode, () => DateArg<Date>> = {
        monthOffset: () => addMonths(focusedDate, value),
        setMonth: () => setMonth(focusedDate, value),
        setYear: () => setYear(focusedDate, value),
        set: () => value,
      };

      const newDate = min([max([modeMapper[mode](), minDate]), maxDate]);
      onDateChange(newDate);
    },
    [focusedDate, maxDate, minDate, onDateChange]
  );

  const handleSelectMonth = useCallback(
    (event: ChangeEvent<HTMLSelectElement>) => {
      changeShownDate(Number(event.target.value), 'setMonth');
    },
    [changeShownDate]
  );

  const handleSelectYear = useCallback(
    (event: ChangeEvent<HTMLSelectElement>) => {
      changeShownDate(Number(event.target.value), 'setYear');
    },
    [changeShownDate]
  );

  const handlePreviousMonth = useCallback(() => {
    changeShownDate(-1, 'monthOffset');
  }, [changeShownDate]);

  const handleNextMonth = useCallback(() => {
    changeShownDate(+1, 'monthOffset');
  }, [changeShownDate]);

  return (
    <div
      onMouseUp={(e) => e.stopPropagation()}
      className={styles.monthAndYearWrapper}
    >
      {showMonthArrow ? (
        <button
          type="button"
          className={classnames(styles.nextPrevButton, styles.prevButton)}
          onClick={handlePreviousMonth}
          aria-label={ariaLabels.prevButton}
        >
          <i />
        </button>
      ) : null}
      {showMonthAndYearPickers ? (
        <span className={styles.monthAndYearPickers}>
          <span className={styles.monthPicker}>
            <select
              value={focusedDate.getMonth()}
              onChange={handleSelectMonth}
              aria-label={ariaLabels.monthPicker}
            >
              {monthNames.map((monthName, i) => (
                <option key={monthName} value={i}>
                  {monthName}
                </option>
              ))}
            </select>
          </span>
          <span className={styles.monthAndYearDivider} />
          <span className={styles.yearPicker}>
            <select
              value={focusedDate.getFullYear()}
              onChange={handleSelectYear}
              aria-label={ariaLabels.yearPicker}
            >
              {new Array(upperYearLimit - lowerYearLimit + 1)
                .fill(upperYearLimit)
                .map((val, i) => {
                  const year = val - i;
                  return (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  );
                })}
            </select>
          </span>
        </span>
      ) : (
        <span className={styles.monthAndYearPickers}>
          {monthNames[focusedDate.getMonth()]} {focusedDate.getFullYear()}
        </span>
      )}
      {showMonthArrow ? (
        <button
          type="button"
          className={classnames(styles.nextPrevButton, styles.nextButton)}
          onClick={handleNextMonth}
          aria-label={ariaLabels.nextButton}
        >
          <i />
        </button>
      ) : null}
    </div>
  );
};
