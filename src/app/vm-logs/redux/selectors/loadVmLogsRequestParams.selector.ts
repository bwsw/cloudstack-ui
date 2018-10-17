import { createSelector } from '@ngrx/store';
import { filterSelectedVmId } from '../vm-logs-vm.reducers';
import { LoadVmLogsRequestParams } from '../../models/load-vm-logs-request-params';
import { filterEndDate, filterKeywords, filterStartDate } from '../vm-logs.reducers';
import moment = require('moment');
import { filterSelectedLogFile } from '../vm-log-files.reducers';

export const loadVmLogsRequestParams = createSelector(
  filterSelectedVmId,
  filterKeywords,
  filterStartDate,
  filterEndDate,
  filterSelectedLogFile,
  (id, keywords, startDate, endDate, logFile): LoadVmLogsRequestParams => {
    const fields = {
      keywords: keywords.map(keyword => keyword.text).join(','),
      startDate: moment(startDate).toISOString().slice(0, -1),
      endDate: moment(endDate).toISOString().slice(0, -1),
      sort: '-timestamp',
      logFile: logFile && logFile.file,
    };

    return Object.keys(fields).reduce((acc, key) => {
      const value = fields[key];

      return {
        ...acc,
        ...(value ? { [key]: value } : null)
      };
    }, { id });
  }
);

