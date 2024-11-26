import { Locale } from 'date-fns';
import { JSX, ReactNode } from 'react';
import {
  AriaLabelsShape,
  Preview,
  Range,
  RangeFocus,
  ScrollOptions,
} from './shared';
import { ClassNames } from './classNames';

export type ShownDateMode = 'set' | 'setYear' | 'setMonth' | 'monthOffset';

export interface CalendarProps {
  /**
   * Custom accessibility aria labels for elements
   *
   * default: `{}`
   */
  ariaLabels?: AriaLabelsShape | undefined;
  /** default: `forwards` */
  calendarFocus?: 'forwards' | 'backwards' | undefined;
  /** default: none */
  className?: string | undefined;
  /**
   * Custom class names for elements
   *
   * default: `{}`
   */
  classNames?: ClassNames | undefined;
  /** default: `#3d91ff` */
  color?: string | undefined;
  /**
   * The currently selected date
   *
   * default: none
   */
  date?: Date | undefined;
  /** default: `MMM d, yyyy` */
  dateDisplayFormat?: string | undefined;
  /**
   * Custom renderer function for the calendar days
   *
   * default: none
   */
  dayContentRenderer?: ((date: Date) => ReactNode) | undefined;
  /** default: `d` */
  dayDisplayFormat?: string | undefined;
  /** default: `vertical` */
  direction?: 'vertical' | 'horizontal' | undefined;
  /** default: `[]` */
  disabledDates?: Date[] | undefined;
  /**
   * Custom function to determine if a day should be disabled
   *
   * default: `() => {}`
   */
  disabledDay?: ((date: Date) => boolean) | undefined;
  /** default: `date` */
  displayMode?: 'dateRange' | 'date' | undefined;
  /** default: `true` */
  dragSelectionEnabled?: boolean | undefined;
  /** default: `false` */
  editableDateInputs?: boolean | undefined;
  /** default: `Continuous` */
  endDatePlaceholder?: string | undefined;
  /** default: `false` */
  fixedHeight?: boolean | undefined;
  /**
   * Which range and step are focused. First value is index of ranges, second value
   * is which step on date range (startDate or endDate)
   *
   * default: `[0, 0]`
   */
  focusedRange?: RangeFocus | undefined;
  /**
   * Initial value for focused range. See `focusedRange` for usage
   *
   * default: none
   */
  initialFocusedRange?: RangeFocus | undefined;
  /**
   * default: `en-US` from `date-fns/locale`
   *
   * Complete list here: https://github.com/hypeserver/react-date-range/blob/next/src/locale/index.js
   */
  locale?: Locale | undefined;
  /** default: 20 years after the current date */
  maxDate?: Date | undefined;
  /** default: 100 years before the current date */
  minDate?: Date | undefined;
  /** default: `MMM yyyy` */
  monthDisplayFormat?: string | undefined;
  /** default: `1` */
  months?: number | undefined;
  /**
   * Custom renderer function for the month and year navigation section
   *
   * default: none
   */
  navigatorRenderer?:
    | ((
        currFocusedDate: Date,
        changeShownDate: (
          value: Date | number | string,
          mode?: ShownDateMode
        ) => void,
        props: CalendarProps
      ) => JSX.Element)
    | undefined;
  /** default: none */
  onChange?: ((date: Date) => void) | undefined;
  /** default: none */
  onPreviewChange?: ((previewDate?: Date) => void) | undefined;
  /** default: none */
  onRangeFocusChange?: ((newFocusedRange: RangeFocus) => void) | undefined;
  /** default: none */
  onShownDateChange?: ((date: Date) => void) | undefined;
  /** default: false */
  preventSnapRefocus?: boolean | undefined;
  /** default: none */
  preview?: Preview | undefined;
  /** default: `['#3d91ff', '#3ecf8e', '#fed14c']` */
  rangeColors?: string[] | undefined;
  /** default: [] */
  ranges?: Range[];
  /**
   * Custom scroll options for various parts of the display
   *
   * default: `{ enabled: false }`
   */
  scroll?: ScrollOptions | undefined;
  /** default: true */
  showDateDisplay?: boolean | undefined;
  /** default: true */
  showMonthAndYearPickers?: boolean | undefined;
  /** default: true */
  showMonthArrow?: boolean | undefined;
  /** default: true */
  showPreview?: boolean | undefined;
  /** default: none */
  shownDate?: Date | undefined;
  /** default: `Early` */
  startDatePlaceholder?: string | undefined;
  /** default: none */
  updateRange?: ((newRange: Range) => void) | undefined;
  /** default: `E` */
  weekdayDisplayFormat?: string | undefined;
  /** default: none */
  weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | undefined;
}
