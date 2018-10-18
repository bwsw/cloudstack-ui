import { createFeatureSelector, createSelector } from '@ngrx/store';
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import * as eventActions from './events.actions';
import { Event } from '../event.model';
import * as fromAccounts from '../../reducers/accounts/redux/accounts.reducers';
import moment = require('moment');

/**
 * @ngrx/entity provides a predefined interface for handling
 * a structured dictionary of records. This interface
 * includes an array of ids, and a dictionary of the provided
 * model type by id. This interface is extended to include
 * any additional interface properties.
 */
export interface State extends EntityState<Event> {
  loading: boolean;
  eventTypes: string[];
  filters: {
    date: Date;
    selectedTypes: string[];
    selectedLevels: string[];
    selectedAccountIds: string[];
    query: string;
  };
}

export interface EventsState {
  list: State;
}

export const reducers = {
  list: reducer,
};

/**
 * createEntityAdapter creates many an object of helper
 * functions for single or multiple operations
 * against the dictionary of records. The configuration
 * object takes a record id selector function and
 * a sortComparer option which is set to a compare
 * function if the records are to be sorted.
 */
export const adapter: EntityAdapter<Event> = createEntityAdapter<Event>({
  selectId: (item: Event) => item.id,
  sortComparer: false,
});

/** getInitialState returns the default initial state
 * for the generated entity state. Initial state
 * additional properties can also be defined.
 */
export const initialState: State = adapter.getInitialState({
  loading: false,
  eventTypes: [],
  filters: {
    date: moment().toDate(),
    selectedTypes: [],
    selectedLevels: [],
    selectedAccountIds: [],
    query: '',
  },
});

export function reducer(state = initialState, action: eventActions.Actions): State {
  switch (action.type) {
    case eventActions.LOAD_EVENTS_REQUEST: {
      return {
        ...state,
        loading: true,
      };
    }
    case eventActions.EVENT_FILTER_UPDATE: {
      return {
        ...state,
        filters: {
          ...state.filters,
          ...action.payload,
        },
      };
    }
    case eventActions.LOAD_EVENTS_RESPONSE: {
      const events = action.payload;
      const types = Object.keys(
        events.reduce((memo, event) => {
          return { ...memo, [event.type]: event.type };
        }, {}),
      );

      return {
        /**
         * The addMany function provided by the created adapter
         * adds many records to the entity dictionary
         * and returns a new state including those records. If
         * the collection is to be sorted, the adapter will
         * sort each record upon entry into the sorted array.
         */
        ...adapter.addAll(events, state),
        eventTypes: types,
        loading: false,
      };
    }

    default: {
      return state;
    }
  }
}

export const getEventsState = createFeatureSelector<EventsState>('events');

export const getEventsEntitiesState = createSelector(getEventsState, state => state.list);

export const { selectIds, selectEntities, selectAll, selectTotal } = adapter.getSelectors(
  getEventsEntitiesState,
);

export const isLoading = createSelector(getEventsEntitiesState, state => state.loading);

export const eventTypes = createSelector(getEventsEntitiesState, state => state.eventTypes);

export const filters = createSelector(getEventsEntitiesState, state => state.filters);

export const filterDate = createSelector(filters, state => state.date);

export const filterQuery = createSelector(filters, state => state.query);

export const filterSelectedTypes = createSelector(filters, state => state.selectedTypes);

export const filterSelectedLevels = createSelector(filters, state => state.selectedLevels);

export const filterSelectedAccountIds = createSelector(filters, state => state.selectedAccountIds);

export const selectFilteredEvents = createSelector(
  selectAll,
  filterQuery,
  filterSelectedTypes,
  filterSelectedLevels,
  filterSelectedAccountIds,
  fromAccounts.selectEntities,
  (events, query, selectedTypes, selectedLevels, selectedAccountIds, accountEntities) => {
    const queryLower = query && query.toLowerCase();
    const typeMap = selectedTypes.reduce((m, i) => ({ ...m, [i]: i }), {});
    const levelsMap = selectedLevels.reduce((m, i) => ({ ...m, [i]: i }), {});

    const queryFilter = event =>
      !query ||
      event.description.toLowerCase().includes(queryLower) ||
      event.level.toLowerCase().includes(queryLower) ||
      event.type.toLowerCase().includes(queryLower) ||
      event.time.toLowerCase().includes(queryLower);

    const selectedTypesFilter = event => !selectedTypes.length || !!typeMap[event.type];

    const selectedLevelsFilter = event => {
      return !selectedLevels.length || !!levelsMap[event.level];
    };

    const accountsMap = selectedAccountIds.reduce((memo, id) => {
      const account = accountEntities[id];
      if (account) {
        return { ...memo, [`${account.name}_${account.domain}`]: account };
      }
      return memo;
    }, {});

    const selectedAccountIdsFilter = event =>
      !selectedAccountIds.length || accountsMap[`${event.account}_${event.domain}`];

    return events.filter(event => {
      return (
        queryFilter(event) &&
        selectedTypesFilter(event) &&
        selectedLevelsFilter(event) &&
        selectedAccountIdsFilter(event)
      );
    });
  },
);
