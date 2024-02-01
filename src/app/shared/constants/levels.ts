import { DropdownOption } from '../components';

export const ENGLISH_LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

export const ENGLISH_LEVELS_OPTIONS: DropdownOption[] = ENGLISH_LEVELS.map(
  (level) => ({
    value: level,
    label: level,
  }),
);
