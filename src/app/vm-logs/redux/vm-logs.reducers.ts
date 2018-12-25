import { createFeatureSelector, createSelector } from '@ngrx/store';
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import * as moment from 'moment';
import { VmLog } from '../models/vm-log.model';
import * as vmLogsActions from './vm-logs.actions';
import { UserTagsSelectors } from '../../root-store';
import { selectIsAutoUpdateEnabled } from './vm-logs-auto-update.reducers';
import { VmLogsFilters } from '../models/vm-log-filters';

export interface State extends EntityState<VmLog> {
  loading: boolean;
  filters: VmLogsFilters;
  uiPage: number;
}

export interface VmLogsState {
  list: State;
}

export const vmLogsReducers = {
  list: reducer,
};

export const adapter: EntityAdapter<VmLog> = createEntityAdapter<VmLog>({
  selectId: vmLog => vmLog.id,
  sortComparer: false,
});

export const initialState: State = adapter.getInitialState({
  loading: false,
  uiPage: 1,
  filters: {
    vm: null,
    accounts: [],
    logFile: null,
    search: null,
    startDate: null,
    endDate: null,
    newestFirst: null,
  },
});

export function reducer(state = initialState, action: vmLogsActions.Actions): State {
  switch (action.type) {
    case vmLogsActions.VmLogsActionTypes.VM_LOGS_UPDATE_VM_ID: {
      return {
        ...state,
        filters: {
          ...state.filters,
          vm: action.payload,
        },
      };
    }

    case vmLogsActions.VmLogsActionTypes.VM_LOGS_UPDATE_ACCOUNT_IDS: {
      return {
        ...state,
        filters: {
          ...state.filters,
          accounts: action.payload,
        },
      };
    }

    case vmLogsActions.VmLogsActionTypes.ENABLE_AUTO_UPDATE:
    case vmLogsActions.VmLogsActionTypes.DISABLE_AUTO_UPDATE: {
      return adapter.removeAll(state);
    }

    case vmLogsActions.VmLogsActionTypes.LOAD_VM_LOGS_REQUEST: {
      return {
        ...adapter.removeAll(state),
        loading: true,
      };
    }

    case vmLogsActions.VmLogsActionTypes.VM_LOGS_UPDATE_SEARCH: {
      return {
        ...state,
        filters: {
          ...state.filters,
          search: action.payload,
        },
      };
    }

    case vmLogsActions.VmLogsActionTypes.LOAD_VM_LOGS_RESPONSE:
    case vmLogsActions.VmLogsActionTypes.UPDATE_AUTO_UPDATE_VM_LOGS: {
      return {
        ...adapter.addAll([...action.payload], state),
        loading: false,
      };
    }

    case vmLogsActions.VmLogsActionTypes.LOAD_AUTO_UPDATE_VM_LOGS_RESPONSE: {
      return {
        ...adapter.addMany([...action.payload], state),
        loading: false,
      };
    }

    case vmLogsActions.VmLogsActionTypes.VM_LOGS_UPDATE_START_DATE_TIME: {
      return {
        ...state,
        filters: {
          ...state.filters,
          startDate: action.payload,
        },
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
          },
        },
      };
    }

    case vmLogsActions.VmLogsActionTypes.VM_LOGS_UPDATE_START_TIME: {
      return {
        ...state,
        filters: {
          ...state.filters,
          startDate: {
            ...state.filters.startDate,
            hours: action.payload.hour,
            minutes: action.payload.minute,
          },
        },
      };
    }

    case vmLogsActions.VmLogsActionTypes.VM_LOGS_UPDATE_END_DATE_TIME: {
      return {
        ...state,
        filters: {
          ...state.filters,
          endDate: action.payload,
        },
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
          },
        },
      };
    }

    case vmLogsActions.VmLogsActionTypes.VM_LOGS_UPDATE_END_TIME: {
      return {
        ...state,
        filters: {
          ...state.filters,
          endDate: {
            ...state.filters.endDate,
            hours: action.payload.hour,
            minutes: action.payload.minute,
          },
        },
      };
    }

    case vmLogsActions.VmLogsActionTypes.VM_LOGS_UPDATE_LOG_FILE: {
      return {
        ...state,
        filters: {
          ...state.filters,
          logFile: action.payload,
        },
      };
    }

    case vmLogsActions.VmLogsActionTypes.VM_LOGS_TOGGLE_NEWEST_FIRST: {
      return {
        ...state,
        filters: {
          ...state.filters,
          newestFirst: !state.filters.newestFirst,
        },
      };
    }

    case vmLogsActions.VmLogsActionTypes.VM_LOGS_UPDATE_NEWEST_FIRST: {
      return {
        ...state,
        filters: {
          ...state.filters,
          newestFirst: action.payload,
        },
      };
    }

    case vmLogsActions.VmLogsActionTypes.SCROLL_VM_LOGS: {
      return {
        ...state,
        uiPage: state.uiPage + 1,
      };
    }

    case vmLogsActions.VmLogsActionTypes.RESET_VM_LOGS_SCROLL: {
      return {
        ...state,
        uiPage: 1,
      };
    }

    default: {
      return state;
    }
  }
}

export const getVmLogsState = createFeatureSelector<VmLogsState>('vmLogs');

export const getVmLogsEntitiesState = createSelector(getVmLogsState, state => state.list);

export const { selectIds, selectEntities, selectAll, selectTotal } = adapter.getSelectors(
  getVmLogsEntitiesState,
);

export const isLoading = createSelector(getVmLogsEntitiesState, state => state.loading);

export const filters = createSelector(getVmLogsEntitiesState, state => state.filters);

export const filterSelectedVmId = createSelector(filters, state => state.vm);

export const filterSelectedAccountIds = createSelector(filters, state => state.accounts);

export const filterSearch = createSelector(filters, state => state.search);

export const filterStartDate = createSelector(filters, state => state.startDate);

export const filterStartTime = createSelector(filters, state => {
  if (state.startDate == null) {
    return null;
  }

  return {
    hour: state.startDate.hours,
    minute: state.startDate.minutes,
  };
});

export const filterEndDate = createSelector(filters, state => state.endDate);

export const filterEndTime = createSelector(filters, state => {
  if (state.endDate == null) {
    return null;
  }

  return {
    hour: state.endDate.hours,
    minute: state.endDate.minutes,
  };
});

export const filterNewestFirst = createSelector(filters, state => Boolean(state.newestFirst));

export const filterSelectedLogFile = createSelector(filters, state => state.logFile);

export const selectUiPage = createSelector(getVmLogsEntitiesState, state => state.uiPage);

export const selectTotalScrollLogs = createSelector(selectUiPage, uiPage => uiPage * 100);

const getFirstLogs = <T>(logs: T[], length: number): T[] => logs.slice(0, length);

const getLastLogs = <T>(logs: T[], limit: number, newestFirst: boolean) => {
  if (newestFirst) {
    return logs.slice(0, limit);
  }

  return logs.slice(-limit, logs.length);
};

export const selectVisibleStaticLogs = createSelector(
  selectAll,
  selectTotalScrollLogs,
  getFirstLogs,
);

export const selectVisibleAutoUpdateLogs = createSelector(
  selectAll,
  UserTagsSelectors.getVmLogsShowLastMessages,
  filterNewestFirst,
  selectTotalScrollLogs,
  (logs, showLastMessages, newestFirst, totalScrollLogs) => {
    const lastLogs = getLastLogs(logs, showLastMessages, newestFirst);
    return getFirstLogs(lastLogs, totalScrollLogs);
  },
);

export const selectVisibleLogs = createSelector(
  selectVisibleStaticLogs,
  selectVisibleAutoUpdateLogs,
  selectIsAutoUpdateEnabled,
  (visibleStaticLogs, visibleAutoUpdateLogs, isAutoUpdateEnabled) => {
    if (isAutoUpdateEnabled) {
      return visibleAutoUpdateLogs;
    }

    return visibleStaticLogs;
  },
);

export const selectAreAllLogsShown = createSelector(
  selectVisibleLogs,
  selectTotalScrollLogs,
  (visibleLogs, totalScrollLogs) => totalScrollLogs >= visibleLogs.length,
);
