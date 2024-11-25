import { Range } from '@react-date-range/types';

export function findNextRangeIndex(
  ranges: Range[] | undefined,
  currentRangeIndex = -1
) {
  if (!ranges) {
    return -1;
  }

  const nextIndex = ranges.findIndex(
    (range, i) =>
      i > currentRangeIndex && range.autoFocus !== false && !range.disabled
  );

  if (nextIndex && nextIndex !== -1) {
    return nextIndex;
  }

  return ranges.findIndex((range) => range.autoFocus && !range.disabled);
}
