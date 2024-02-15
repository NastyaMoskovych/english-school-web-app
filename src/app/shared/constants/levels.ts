import { DropdownOption } from '../components';

import { ENGLISH_LEVELS } from '@firebase-api/constants';

export const ENGLISH_LEVELS_OPTIONS: DropdownOption[] = ENGLISH_LEVELS.map(
  (level) => ({
    value: level,
    label: level,
  }),
);
