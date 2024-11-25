import React, {
  DetailedHTMLProps,
  InputHTMLAttributes,
  useCallback,
  useState,
} from 'react';
import { format, FormatOptions, isValid, parse, ParseOptions } from 'date-fns';
import classnames from 'classnames';

const formatDate = ({
  value,
  dateDisplayFormat,
  dateOptions,
}: {
  value: string | undefined;
  dateDisplayFormat: string;
  dateOptions: FormatOptions;
}) => {
  if (value && isValid(value)) {
    return format(value, dateDisplayFormat, dateOptions);
  }

  return '';
};

type InputProps = DetailedHTMLProps<
  InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
>;

type DateInputProps = {
  onChange: (value: Date | undefined) => void;
  value: string | undefined;
  dateDisplayFormat: string;
  dateOptions: FormatOptions;
  className?: string;
  readOnly?: InputProps['readOnly'];
  disabled?: InputProps['disabled'];
  placeholder?: InputProps['placeholder'];
  ariaLabel?: InputProps['aria-label'];
  onFocus?: InputProps['onFocus'];
};

export const DateInput: React.FC<DateInputProps> = ({
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
  const [isInvalid, setIsInvalid] = useState(false);
  const [hasChanged, setHasChanged] = useState(false);
  const [currentValue, setCurrentValue] = useState(() =>
    formatDate({ dateDisplayFormat, dateOptions, value })
  );

  const update = useCallback((value: string | undefined) => {
    if (isInvalid || !hasChanged || !value) {
      return;
    }

    const parsed = parse(
      value,
      dateDisplayFormat,
      new Date(),
      dateOptions as ParseOptions
    );

    if (isValid(parsed)) {
      setHasChanged(false);
      onChange(parsed);
    } else {
      setIsInvalid(true);
    }
  }, []);

  const onKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      update(currentValue);
    }
  }, []);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentValue(e.target.value);
    setHasChanged(true);
    setIsInvalid(false);
  }, []);

  const onBlur = useCallback(() => {
    update(currentValue);
  }, []);

  return (
    <span className={classnames('rdrDateInput', className)}>
      <input
        readOnly={readOnly}
        disabled={disabled}
        value={value}
        placeholder={placeholder}
        aria-label={ariaLabel}
        onKeyDown={onKeyDown}
        onChange={handleChange}
        onBlur={onBlur}
        onFocus={onFocus}
      />
      {isInvalid && <span className="rdrWarning">&#9888;</span>}
    </span>
  );
};
