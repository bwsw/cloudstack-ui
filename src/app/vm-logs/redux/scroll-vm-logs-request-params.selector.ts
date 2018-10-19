import { createSelector } from '@ngrx/store';
import { selectScrollId } from './scroll-vm-logs.reducers';
import { ScrollVmLogsRequestParams } from '../models/scroll-vm-logs-request-params';


export const scrollVmLogsRequestParams = createSelector(
  selectScrollId,
  (scrollId): ScrollVmLogsRequestParams => ({
    scrollId,
    timeout: 1000
  })
);
