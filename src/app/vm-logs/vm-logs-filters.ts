import * as moment from 'moment';
import * as pickBy from 'lodash/pickBy';
import { FilterConfig } from '../shared/services/filter.service';

export const vmLogsFilters: FilterConfig = {
  vm: { type: 'string' },
  accounts: { type: 'array', defaultOption: [] },
  search: { type: 'string' },
  startDate: { type: 'string' },
  endDate: { type: 'string' },
  logFile: { type: 'string' },
  newestFirst: { type: 'boolean' },
};

export const parseVmLogsFilters = params => {
  const convertedParams = {
    ...params,
    startDate: params.startDate && moment(params.startDate).toObject(),
    endDate: params.endDate && moment(params.endDate).toObject(),
  };

  return pickBy(convertedParams, param => param != null);
};

export const getVmLogsFiltersDefaultValues = () => ({
  startDate: moment()
    .add(-1, 'days')
    .set({
      hours: 0,
      minutes: 0,
      seconds: 0,
      milliseconds: 0,
    })
    .toObject(),
  endDate: moment()
    .set({
      hours: 23,
      minutes: 59,
      seconds: 59,
      milliseconds: 999,
    })
    .toObject(),
});
