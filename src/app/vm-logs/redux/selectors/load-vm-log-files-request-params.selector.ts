import { createSelector } from '@ngrx/store';
import { filterSelectedVmId } from '../vm-logs-vm.reducers';
import { LoadVmLogFilesRequestParams } from '../../models/load-vm-log-files-request-params';

export const loadVmLogFilesRequestParams = createSelector(
  filterSelectedVmId,
  (id): LoadVmLogFilesRequestParams => ({
    id,
  }),
);
