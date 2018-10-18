import { createSelector } from '@ngrx/store';
import { filterSelectedVmId } from '../vm-logs-vm.reducers';
import { LoadVmLogsRequestParams } from '../../models/load-vm-logs-request-params';
import { filterEndDate, filterKeywords, filterSelectedLogFile, filterStartDate } from '../vm-logs.reducers';
import moment = require('moment');
import * as pickBy from 'lodash/pickBy';


export const loadVmLogsRequestParams = createSelector(
  filterSelectedVmId,
  filterKeywords,
  filterStartDate,
  filterEndDate,
  filterSelectedLogFile,
  (id, keywords, startDate, endDate, logFile): LoadVmLogsRequestParams => {
    const fields = {
      id,
      keywords: keywords.map(keyword => keyword.text).join(','),
      startDate: moment(startDate).toISOString().slice(0, -1),
      endDate: moment(endDate).toISOString().slice(0, -1),
      sort: '-timestamp',
      logFile,
    };

    return pickBy(fields, Boolean);
  }
);

