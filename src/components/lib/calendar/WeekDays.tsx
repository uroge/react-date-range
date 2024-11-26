import {
  eachDayOfInterval,
  endOfWeek,
  format,
  Locale,
  startOfWeek,
} from 'date-fns';
import { FC } from 'react';

type WeekDaysProps = {
  dateOptions: { locale: Locale };
  styles: Record<string, string>;
  weekdayDisplayFormat: string;
};

export const WeekDays: FC<WeekDaysProps> = ({
  dateOptions,
  styles,
  weekdayDisplayFormat,
}) => {
  const today = new Date();
  return (
    <div className={styles.weekDays}>
      {eachDayOfInterval({
        start: startOfWeek(today, dateOptions),
        end: endOfWeek(today, dateOptions),
      }).map((day) => (
        <span className={styles.weekDay} key={day.toISOString()}>
          {format(day, weekdayDisplayFormat, dateOptions)}
        </span>
      ))}
    </div>
  );
};
