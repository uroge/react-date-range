export type ScrollOptions = {
  enabled?: boolean | undefined;
  calendarWidth?: number | undefined;
  calendarHeight?: number | undefined;
  longMonthHeight?: number | undefined;
  monthHeight?: number | undefined;
  monthWidth?: number | undefined;
};

export type AriaLabelsShape = {
  dateInput?: RangeKeyDict | undefined;
  monthPicker?: string | undefined;
  yearPicker?: string | undefined;
  prevButton?: string | undefined;
  nextButton?: string | undefined;
};

export type RangeKeyDict = {
  [key: string]: Range;
};

export type Range = {
  startDate?: Date | undefined;
  endDate?: Date | undefined;
  color?: string | undefined;
  key?: string | undefined;
  autoFocus?: boolean | undefined;
  disabled?: boolean | undefined;
  showDateDisplay?: boolean | undefined;
};

/**
 * Represents which range and step are focused: `[range, rangeStep]`. Common initial value is `[0, 0]`.
 * - `range` represents the index in the list of ranges of the range that's focused
 * - `rangeStep` is which step on the range is focused: `0` for start date and `1` for end date
 */
export type RangeFocus = [number, 0 | 1];

export type Preview = Pick<Range, 'startDate' | 'endDate' | 'color'>;
