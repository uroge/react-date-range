import React, { useState, useCallback } from 'react';
import classnames from 'classnames';
import {
  startOfDay,
  format,
  isSameDay,
  isAfter,
  isBefore,
  endOfDay,
} from 'date-fns';
import { Preview, Range, Styles } from '@react-date-range/types';
import './dayCell.scss';

type DayCellProps = {
  day: Date;
  dayDisplayFormat?: string;
  date?: Date;
  ranges?: Range[];
  preview?: Preview;
  previewColor?: string;
  disabled?: boolean;
  isPassive?: boolean;
  isToday?: boolean;
  isWeekend?: boolean;
  isStartOfWeek?: boolean;
  isEndOfWeek?: boolean;
  isStartOfMonth?: boolean;
  isEndOfMonth?: boolean;
  color?: string;
  displayMode?: 'dateRange' | 'date';
  styles: Styles;
  onPreviewChange?: (day?: Date) => void;
  onMouseDown?: (day: Date) => void;
  onMouseUp?: (day: Date) => void;
  onMouseEnter?: (day: Date) => void;
  dayContentRenderer?: (day: Date) => React.ReactNode;
};

export const DayCell: React.FC<DayCellProps> = React.memo(
  ({
    day,
    dayDisplayFormat = 'd',
    date,
    ranges = [],
    preview,
    onPreviewChange,
    disabled = false,
    isPassive = false,
    isToday = false,
    isWeekend = false,
    isStartOfWeek = false,
    isEndOfWeek = false,
    isStartOfMonth = false,
    isEndOfMonth = false,
    color,
    displayMode = 'dateRange',
    styles,
    onMouseDown,
    onMouseUp,
    onMouseEnter,
    dayContentRenderer,
  }) => {
    const [hover, setHover] = useState(false);
    const [active, setActive] = useState(false);

    const handleMouseEvent = useCallback(
      (event: React.MouseEvent | React.FocusEvent) => {
        if (disabled) {
          onPreviewChange?.();
          return;
        }

        const stateChanges: Partial<{ hover: boolean; active: boolean }> = {};

        switch (event.type) {
          case 'mouseenter':
            onMouseEnter?.(day);
            onPreviewChange?.(day);
            stateChanges.hover = true;
            break;
          case 'mouseleave':
          case 'blur':
            stateChanges.hover = false;
            break;
          case 'mousedown':
            setActive(true);
            onMouseDown?.(day);
            break;
          case 'mouseup':
            event.stopPropagation();
            setActive(false);
            onMouseUp?.(day);
            break;
          case 'focus':
            onPreviewChange?.(day);
            break;
        }

        if (stateChanges.hover !== undefined) {
          setHover(stateChanges.hover);
        }

        if (stateChanges.active !== undefined) {
          setActive(stateChanges.active);
        }
      },
      [disabled, day, onMouseEnter, onPreviewChange, onMouseDown, onMouseUp]
    );

    const handleKeyEvent = useCallback(
      (event: React.KeyboardEvent) => {
        if (event.code === 'Enter' || event.code === 'Space') {
          if (event.type === 'keydown') {
            onMouseDown?.(day);
          } else {
            onMouseUp?.(day);
          }
        }
      },
      [day, onMouseDown, onMouseUp]
    );

    const getClassNames = useCallback(() => {
      return classnames(styles.day, {
        [styles.dayPassive]: isPassive,
        [styles.dayDisabled]: disabled,
        [styles.dayToday]: isToday,
        [styles.dayWeekend]: isWeekend,
        [styles.dayStartOfWeek]: isStartOfWeek,
        [styles.dayEndOfWeek]: isEndOfWeek,
        [styles.dayStartOfMonth]: isStartOfMonth,
        [styles.dayEndOfMonth]: isEndOfMonth,
        [styles.dayHovered]: hover,
        [styles.dayActive]: active,
      });
    }, [
      styles,
      isPassive,
      disabled,
      isToday,
      isWeekend,
      isStartOfWeek,
      isEndOfWeek,
      isStartOfMonth,
      isEndOfMonth,
      hover,
      active,
    ]);

    const renderPreviewPlaceholder = useCallback(() => {
      if (!preview) return null;

      const startDate = preview.startDate ? endOfDay(preview.startDate) : null;
      const endDate = preview.endDate ? startOfDay(preview.endDate) : null;
      const isInRange =
        (!startDate || isAfter(day, startDate)) &&
        (!endDate || isBefore(day, endDate));
      const isStartEdge = !isInRange && startDate && isSameDay(day, startDate);
      const isEndEdge = !isInRange && endDate && isSameDay(day, endDate);

      return (
        <span
          className={classnames({
            [styles.dayStartPreview]: isStartEdge,
            [styles.dayInPreview]: isInRange,
            [styles.dayEndPreview]: isEndEdge,
          })}
          style={{ color: preview.color }}
        />
      );
    }, [preview, day, styles]);

    const renderSelectionPlaceholders = useCallback(() => {
      if (displayMode === 'date') {
        const isSelected = isSameDay(day, date!);
        return isSelected ? (
          <span className={styles.selected} style={{ color }} />
        ) : null;
      }

      const inRanges = ranges.reduce((result, range) => {
        let { startDate, endDate } = range;
        if (startDate && endDate && isBefore(endDate, startDate)) {
          [startDate, endDate] = [endDate, startDate];
        }

        startDate = startDate ? endOfDay(startDate) : undefined;
        endDate = endDate ? startOfDay(endDate) : undefined;

        const isInRange =
          (!startDate || isAfter(day, startDate)) &&
          (!endDate || isBefore(day, endDate));
        const isStartEdge =
          !isInRange && startDate && isSameDay(day, startDate);
        const isEndEdge = !isInRange && endDate && isSameDay(day, endDate);

        if (isInRange || isStartEdge || isEndEdge) {
          return [
            ...result,
            {
              isStartEdge,
              isEndEdge,
              isInRange,
              ...range,
            },
          ];
        }
        return result;
      }, [] as Range[]);

      return inRanges.map((range) => (
        <span
          key={range.startDate?.toISOString()}
          className={classnames({
            [styles.startEdge]: range.isStartEdge,
            [styles.endEdge]: range.isEndEdge,
            [styles.inRange]: range.isInRange,
          })}
          style={{ color: range.color || color }}
        />
      ));
    }, [displayMode, day, date, ranges, styles, color]);

    return (
      <button
        type="button"
        onMouseEnter={handleMouseEvent}
        onMouseLeave={handleMouseEvent}
        onFocus={handleMouseEvent}
        onMouseDown={handleMouseEvent}
        onMouseUp={handleMouseEvent}
        onBlur={handleMouseEvent}
        onKeyDown={handleKeyEvent}
        onKeyUp={handleKeyEvent}
        className={getClassNames()}
        tabIndex={disabled || isPassive ? -1 : undefined}
        style={{ color }}
      >
        {renderSelectionPlaceholders()}
        {renderPreviewPlaceholder()}
        <span className={styles.dayNumber}>
          {dayContentRenderer?.(day) || (
            <span>{format(day, dayDisplayFormat)}</span>
          )}
        </span>
      </button>
    );
  }
);
