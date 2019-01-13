import { createSelector } from '@ngrx/store';
import * as moment from 'moment';
import { LoadVmLogsRequestParams } from '../../models/load-vm-logs-request-params';
import {
  filterSelectedVmId,
  filterSearch,
  filterNewestFirst,
  filterSelectedLogFile,
} from '../vm-logs.reducers';
const pickBy = require('lodash/pickBy');
import { selectStartDate, selectEndDate } from '../vm-logs-auto-update.reducers';

export const loadAutoUpdateVmLogsRequestParams = createSelector(
  filterSelectedVmId,
  filterSearch,
  selectStartDate,
  selectEndDate,
  filterSelectedLogFile,
  filterNewestFirst,
  (id, search, startDate, endDate, logFile, newestFirst): LoadVmLogsRequestParams => {
    const fields = {
      id,
      logFile,
      keywords: search,
      startDate:
        (startDate &&
          moment(startDate)
            .toISOString()
            .slice(0, -1)) ||
        null,
      endDate:
        (endDate &&
          moment(endDate)
            .toISOString()
            .slice(0, -1)) ||
        null,
      sort: newestFirst ? '-timestamp' : 'timestamp',
    };

    return pickBy(fields, Boolean);
  },
);
