import { createSelector } from '@ngrx/store';
import { filterSelectedVmId } from '../vm-logs-vm.reducers';
import { LoadVmLogsRequestParams } from '../../models/load-vm-logs-request-params';
import {
  filterEndDate,
  filterSearch,
  filterNewestFirst,
  filterSelectedLogFile,
  filterStartDate,
} from '../vm-logs.reducers';
import moment = require('moment');
import * as pickBy from 'lodash/pickBy';

export const loadVmLogsRequestParams = createSelector(
  filterSelectedVmId,
  filterSearch,
  filterStartDate,
  filterEndDate,
  filterSelectedLogFile,
  filterNewestFirst,
  (id, search, startDate, endDate, logFile, newestFirst): LoadVmLogsRequestParams => {
    const fields = {
      id,
      logFile,
      keywords: search,
      startDate: moment(startDate)
        .toISOString()
        .slice(0, -1),
      endDate: moment(endDate)
        .toISOString()
        .slice(0, -1),
      sort: newestFirst ? '-timestamp' : 'timestamp',
    };

    return pickBy(fields, Boolean);
  },
);
