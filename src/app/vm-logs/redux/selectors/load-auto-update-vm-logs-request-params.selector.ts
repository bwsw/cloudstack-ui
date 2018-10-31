import { createSelector } from '@ngrx/store';
import { filterSelectedVmId } from '../vm-logs-vm.reducers';
import { LoadVmLogsRequestParams } from '../../models/load-vm-logs-request-params';
import { filterKeywords, filterNewestFirst, filterSelectedLogFile } from '../vm-logs.reducers';
import * as pickBy from 'lodash/pickBy';
import { selectStartDate, selectEndDate } from '../vm-logs-auto-update.reducers';
import moment = require('moment');

export const loadAutoUpdateVmLogsRequestParams = createSelector(
  filterSelectedVmId,
  filterKeywords,
  selectStartDate,
  selectEndDate,
  filterSelectedLogFile,
  filterNewestFirst,
  (id, keywords, startDate, endDate, logFile, newestFirst): LoadVmLogsRequestParams => {
    const fields = {
      id,
      logFile,
      keywords: keywords.map(keyword => keyword.text).join(','),
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
