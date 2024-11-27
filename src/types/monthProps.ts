import { CSSProperties } from 'react';
import { DateOptions, Drag, Styles, Range } from './shared';

export type MonthProps = {
  style?: CSSProperties;
  styles: Styles;
  month: Date;
  drag: Drag;
  dateOptions?: DateOptions;
  disabledDates?: Date[];
  disabledDay?: (date: Date) => boolean;
  preview?: {
    startDate?: Date;
    endDate?: Date;
  };
  showPreview?: boolean;
  displayMode?: 'dateRange' | 'date';
  minDate?: Date;
  maxDate?: Date;
  ranges?: Range[];
  focusedRange?: [number, number];
  onDragSelectionStart?: (date: Date) => void;
  onDragSelectionEnd?: (date: Date) => void;
  onDragSelectionMove?: (date: Date) => void;
  onMouseLeave?: () => void;
  monthDisplayFormat: string;
  weekdayDisplayFormat: string;
  dayDisplayFormat: string;
  showWeekDays?: boolean;
  showMonthName?: boolean;
  fixedHeight?: boolean;
  onPreviewChange?: () => void;
};
