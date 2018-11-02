import { createSelector } from '@ngrx/store';
import { filterNewestFirst } from '../vm-logs.reducers';
import { selectIsAutoUpdateEnabled } from '../vm-logs-auto-update.reducers';

export const selectIsAutoUpdateWithScroll = createSelector(
  selectIsAutoUpdateEnabled,
  filterNewestFirst,
  (isAutoUpdateEnabled, newestFirst) => isAutoUpdateEnabled && !newestFirst,
);
