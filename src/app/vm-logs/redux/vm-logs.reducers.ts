import { createFeatureSelector, createSelector } from '@ngrx/store';
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { VmLog } from '../models/vm-log.model';
import * as vmLogsActions from './vm-logs.actions';
import { Keyword } from '../models/keyword.model';
import { LoadVmLogsRequestParams } from '../models/load-vm-logs-request-params';
import { DateObject } from '../models/date-object.model';
import * as fromVMs from '../../reducers/vm/redux/vm.reducers';
import * as fromAccounts from '../../reducers/accounts/redux/accounts.reducers';
import moment = require('moment');
import { VmLogsUpdateStartDate } from './vm-logs.actions';


export interface VmLogsFilters {
  selectedVmId: string,
  selectedAccountIds: Array<string>,
  keywords: Array<Keyword>,
  startDate: DateObject,
  endDate: DateObject,
  newestFirst: boolean
};

export interface State extends EntityState<VmLog> {
  loading: boolean,
  filters: VmLogsFilters
}

export interface VmLogsState {
  list: State;
}

export const vmLogsReducers = {
  list: reducer,
};

export const adapter: EntityAdapter<VmLog> = createEntityAdapter<VmLog>({
  selectId: () => Math.random(),
  sortComparer: false
});

export const initialState: State = adapter.getInitialState({
  loading: false,
  filters: {
    selectedVmId: null,
    selectedAccountIds: [],
    keywords: [],
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
    newestFirst: false
  }
});

export function reducer(
  state = initialState,
  action: vmLogsActions.Actions
): State {
  switch (action.type) {
    case vmLogsActions.VmLogsActionTypes.LOAD_VM_LOGS_REQUEST: {
      return {
        ...state,
        loading: true
      };
    }

    case vmLogsActions.VmLogsActionTypes.VM_LOGS_FILTER_UPDATE: {
      return {
        ...state,
        filters: {
          ...state.filters,
          ...action.payload,
        }
      };
    }

    case vmLogsActions.VmLogsActionTypes.VM_LOGS_ADD_KEYWORD: {
      return {
        ...state,
        filters: {
          ...state.filters,
          keywords: state.filters.keywords.concat(action.payload)
        }
      }
    }

    case vmLogsActions.VmLogsActionTypes.VM_LOGS_REMOVE_KEYWORD: {
      return {
        ...state,
        filters: {
          ...state.filters,
          keywords: state.filters.keywords.filter(keyword => keyword !== action.payload)
        }
      }
    }

    case vmLogsActions.VmLogsActionTypes.VM_LOGS_UPDATE_ACCOUNT_IDS: {
      return {
        ...state,
        filters: {
          ...state.filters,
          selectedAccountIds: action.payload,
        }
      }
    }

    case vmLogsActions.VmLogsActionTypes.LOAD_VM_LOGS_RESPONSE: {
      return {
        ...adapter.addAll([...action.payload], state),
        loading: false
      };
    }

    case vmLogsActions.VmLogsActionTypes.VM_LOGS_UPDATE_START_DATE: {
      const { years, months, date } = moment(action.payload).toObject();

      return {
        ...state,
        filters: {
          ...state.filters,
          startDate: {
            ...state.filters.startDate,
            years,
            months,
            date,
          }
        }
      };
    }

    case vmLogsActions.VmLogsActionTypes.VM_LOGS_UPDATE_START_TIME: {
      // todo: remove
      if (
        action.payload.hour === state.filters.startDate.hours
        && action.payload.minute === state.filters.startDate.minutes
      ) {
        return state;
      }

      return {
        ...state,
        filters: {
          ...state.filters,
          startDate: {
            ...state.filters.startDate,
            hours: action.payload.hour,
            minutes: action.payload.minute,
          }
        }
      };
    }

    case vmLogsActions.VmLogsActionTypes.VM_LOGS_UPDATE_END_DATE: {
      const { years, months, date } = moment(action.payload).toObject();

      return {
        ...state,
        filters: {
          ...state.filters,
          endDate: {
            ...state.filters.endDate,
            years,
            months,
            date,
          }
        }
      };
    }

    case vmLogsActions.VmLogsActionTypes.VM_LOGS_UPDATE_END_TIME: {
      // todo: remove
      if (
        action.payload.hour === state.filters.endDate.hours
        && action.payload.minute === state.filters.endDate.minutes
      ) {
        return state;
      }

      return {
        ...state,
        filters: {
          ...state.filters,
          endDate: {
            ...state.filters.endDate,
            hours: action.payload.hour,
            minutes: action.payload.minute,
          }
        }
      };
    }

    case vmLogsActions.VmLogsActionTypes.VM_LOGS_TOGGLE_NEWEST_FIRST: {
      return {
        ...state,
        filters: {
          ...state.filters,
          newestFirst: !state.filters.newestFirst
        }
      }
    }

    default: {
      return state;
    }
  }
}


export const getVmLogsState = createFeatureSelector<VmLogsState>('vmLogs');

export const getVmLogsEntitiesState = createSelector(
  getVmLogsState,
  state => state.list
);

export const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
} = adapter.getSelectors(getVmLogsEntitiesState);

export const isLoading = createSelector(
  getVmLogsEntitiesState,
  state => state.loading
);

export const filters = createSelector(
  getVmLogsEntitiesState,
  state => state.filters
);

export const filterSelectedVmId = createSelector(
  filters,
  state => state.selectedVmId
);

export const filterKeywords = createSelector(
  filters,
  state => state.keywords
);

export const filterStartDate = createSelector(
  filters,
  state => state.startDate
);

export const filterStartTime = createSelector(
  filters,
  state => ({
    hour: state.startDate.hours,
    minute: state.startDate.minutes
  })
);

export const filterEndDate = createSelector(
  filters,
  state => state.endDate
);

export const filterEndTime = createSelector(
  filters,
  state => ({
    hour: state.endDate.hours,
    minute: state.endDate.minutes
  })
);

export const filterSelectedAccountIds = createSelector(
  filters,
  state => state.selectedAccountIds
);

export const filterNewestFirst = createSelector(
  filters,
  state => state.newestFirst
);

export const selectFilteredVMs = createSelector(
  fromVMs.selectAll,
  filterSelectedAccountIds,
  filterSelectedVmId,
  fromAccounts.selectAll,
  (
    vms,
    selectedAccountIds,
    selectedVmId,
    accounts
  ) => {
    const selectedAccounts = accounts.filter(
      account => selectedAccountIds.find(id => id === account.id));
    const accountsMap = selectedAccounts.reduce((m, i) => ({ ...m, [i.name]: i }), {});
    const domainsMap = selectedAccounts.reduce((m, i) => ({ ...m, [i.domainid]: i }), {});

    const selectedAccountIdsFilter = vm => !selectedAccountIds.length ||
      (accountsMap[vm.account] && domainsMap[vm.domainid]);

    const selectedVm = vms.find(vm => vm.id === selectedVmId);
    const filteredVms = vms.filter(vm => selectedAccountIdsFilter(vm));

    if (!filteredVms.find(vm => vm.id === selectedVmId) && selectedVm) {
      return filteredVms.concat(selectedVm);
    }

    return filteredVms;
  }
);

export const loadVmLogsRequestParams = createSelector(
  filterSelectedVmId,
  filterKeywords,
  filterStartDate,
  filterEndDate,
  filterNewestFirst,
  (
    id,
    keywords,
    startDate,
    endDate,
    newestFirst
  ): LoadVmLogsRequestParams => {
    const fields = {
      keywords: keywords.map(keyword => keyword.text).join(','),
      startDate: moment(startDate).toISOString().slice(0, -1),
      endDate: moment(endDate).toISOString().slice(0, -1),
      sort: newestFirst ? '-timestamp' : 'timestamp'
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