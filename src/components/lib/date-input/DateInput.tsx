import {
  DetailedHTMLProps,
  InputHTMLAttributes,
  useCallback,
  useRef,
  useState,
  FC,
  ChangeEvent,
  KeyboardEvent,
} from 'react';
import {
  format,
  FormatOptions,
  isValid as isValidDate,
  parse,
  ParseOptions,
} from 'date-fns';
import classnames from 'classnames';
import './dateInput.scss';

const formatDate = ({
  value,
  dateDisplayFormat,
  dateOptions,
}: {
  value: Date | undefined;
  dateDisplayFormat: string;
  dateOptions: FormatOptions;
}) => {
  if (value && isValidDate(new Date(value))) {
    return format(value, dateDisplayFormat, dateOptions);
  }

  return '';
};

type InputProps = DetailedHTMLProps<
  InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
>;

type DateInputProps = {
  onChange: (value: Date) => void;
  value: Date | undefined;
  dateDisplayFormat: string;
  dateOptions: FormatOptions;
  className?: string;
  readOnly?: InputProps['readOnly'];
  disabled?: InputProps['disabled'];
  placeholder?: InputProps['placeholder'];
  ariaLabel?: InputProps['aria-label'];
  onFocus?: InputProps['onFocus'];
};

export const DateInput: FC<DateInputProps> = ({
  onChange,
  value,
  dateDisplayFormat,
  dateOptions,
  className,
  readOnly,
  disabled,
  placeholder,
  ariaLabel,
  onFocus,
}) => {
  const [isValid, setValid] = useState(true);
  const initialValueRef = useRef(
    formatDate({ dateDisplayFormat, dateOptions, value })
  );
  const [currentValue, setCurrentValue] = useState(initialValueRef.current);
  const hasChanged = initialValueRef.current !== currentValue;
  // TODO: usePrevious(currentValue) and derive hasChanged based on that
  // in order on to call update when the value is the same as the last time

  const update = useCallback(
    (newValue: string | undefined) => {
      if (!isValid || !hasChanged || !newValue) {
        return;
      }
      const parsed = parse(
        newValue,
        dateDisplayFormat,
        new Date(),
        dateOptions as ParseOptions
      );

      if (isValidDate(parsed)) {
        onChange(parsed);
      } else {
        setValid(false);
      }
    },
    [dateDisplayFormat, dateOptions, hasChanged, isValid, onChange]
  );

  const onKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        update(currentValue);
      }
    },
    [currentValue, update]
  );

  const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setCurrentValue(e.target.value);
    setValid(true);
  }, []);

  const onBlur = useCallback(() => {
    update(currentValue);
  }, [currentValue, update]);

  return (
    <span className={classnames('rdrDateInput', className)}>
      <input
        readOnly={readOnly}
        disabled={disabled}
        value={currentValue}
        placeholder={placeholder}
        aria-label={ariaLabel}
        onKeyDown={onKeyDown}
        onChange={handleChange}
        onBlur={onBlur}
        onFocus={onFocus}
      />
      {!isValid && <span className="rdrWarning">&#9888;</span>}
    </span>
  );
};
