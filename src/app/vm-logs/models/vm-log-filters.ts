import { DateObject } from './date-object.model';

export interface VmLogsFilters {
  vm: string;
  accounts: string[];
  search: string;
  startDate: DateObject;
  endDate: DateObject;
  logFile: string;
  newestFirst: boolean;
}
