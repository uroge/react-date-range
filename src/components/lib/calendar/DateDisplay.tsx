import { FC } from 'react';
import { Range, Styles } from '@react-date-range/types';
import classnames from 'classnames';
import { DateInput } from '../date-input/DateInput';
import { AriaLabelsShape, RangeFocus } from 'src/types/shared';
import { Locale } from 'date-fns';

type DateDisplayProps = {
  styles: Styles;
  ranges: Range[];
  focusedRange: RangeFocus;
  rangeColors: string[];
  ariaLabels: AriaLabelsShape;
  editableDateInputs: boolean;
  startDatePlaceholder: string;
  endDatePlaceholder: string;
  dateDisplayFormat: string;
  dateOptions: { locale: Locale };
  onStartDateFocus: (index: number) => void;
  onEndDateFocus: (index: number) => void;
  onDateInputChange: (date: Date) => void;
};

export const DateDisplay: FC<DateDisplayProps> = ({
  styles,
  ranges,
  focusedRange,
  rangeColors,
  ariaLabels,
  editableDateInputs,
  startDatePlaceholder,
  endDatePlaceholder,
  dateDisplayFormat,
  dateOptions,
  onEndDateFocus,
  onStartDateFocus,
  onDateInputChange,
}) => {
  const defaultColor = rangeColors[focusedRange[0]];

  return (
    <div className={styles.dateDisplayWrapper}>
      {ranges.map((range, index) => {
        if (
          range.showDateDisplay === false ||
          (range.disabled && !range.showDateDisplay)
        )
          return null;
        return (
          <div
            className={styles.dateDisplay}
            key={range.startDate?.toISOString()}
            style={{ color: range.color || defaultColor }}
          >
            <DateInput
              className={classnames(styles.dateDisplayItem, {
                [styles.dateDisplayItemActive]:
                  focusedRange[0] === index && focusedRange[1] === 0,
              })}
              readOnly={!editableDateInputs}
              disabled={range.disabled}
              value={range.startDate}
              placeholder={startDatePlaceholder}
              dateOptions={dateOptions}
              dateDisplayFormat={dateDisplayFormat}
              ariaLabel={
                range.key &&
                ariaLabels.dateInput?.[range.key] &&
                ariaLabels.dateInput[range.key].startDate?.toISOString()
              }
              onChange={onDateInputChange}
              onFocus={() => onStartDateFocus(index)}
            />
            <DateInput
              className={classnames(styles.dateDisplayItem, {
                [styles.dateDisplayItemActive]:
                  focusedRange[0] === index && focusedRange[1] === 1,
              })}
              readOnly={!editableDateInputs}
              disabled={range.disabled}
              value={range.endDate}
              placeholder={endDatePlaceholder}
              dateOptions={dateOptions}
              dateDisplayFormat={dateDisplayFormat}
              ariaLabel={
                range.key &&
                ariaLabels.dateInput?.[range.key] &&
                ariaLabels.dateInput[range.key].endDate?.toISOString()
              }
              onChange={onDateInputChange}
              onFocus={() => onEndDateFocus(index)}
            />
          </div>
        );
      })}
    </div>
  );
};
