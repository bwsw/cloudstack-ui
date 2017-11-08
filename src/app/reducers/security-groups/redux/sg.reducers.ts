import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { SecurityGroup, SecurityGroupType } from '../../../security-group/sg.model';
import * as securityGroup from './sg.actions';
import { SecurityGroupViewMode } from '../../../security-group/sg-filter/containers/sg-filter.container';

export interface State {
  list: ListState,
  form: FormState
}

export interface ListState extends EntityState<SecurityGroup> {
  filters: {
    viewMode: string,
    query: string,
    vm: string
  },
  loading: boolean,
  selectedSecurityGroupId: string | null
}

export const sortByName = (a: SecurityGroup, b: SecurityGroup) => {
  return a.name.localeCompare(b.name);
};

export const adapter: EntityAdapter<SecurityGroup> = createEntityAdapter<SecurityGroup>({
  selectId: (item: SecurityGroup) => item.id,
  sortComparer: false
});

const initialListState: ListState = adapter.getInitialState({
  filters: {
    query: '',
    viewMode: 'templates',
    vm: ''
  },
  loading: false,
  selectedSecurityGroupId: null
});

export interface FormState {
  loading: boolean,
  error: object
}

const initialFormState: FormState = {
  loading: false,
  error: null
};


export interface SecurityGroupsState {
  list: ListState;
  form: FormState;
}

export const securityGroupReducers = {
  list: listReducer,
  form: formReducer
};

export function listReducer(
  state = initialListState,
  action: securityGroup.Actions
): ListState {
  switch (action.type) {
    case securityGroup.LOAD_SG_REQUEST: {
      return {
        ...state,
        loading: true
      };
    }
    case securityGroup.SG_FILTER_UPDATE: {
      return {
        ...state,
        filters: {
          ...state.filters,
          ...action.payload
        }
      };
    }
    case securityGroup.LOAD_SG_RESPONSE: {
      return {
        /**
         * The addMany function provided by the created adapter
         * adds many records to the entity dictionary
         * and returns a new state including those records. If
         * the collection is to be sorted, the adapter will
         * sort each record upon entry into the sorted array.
         */
        ...adapter.addAll([...action.payload], { ...state, loading: false }),
      };
    }
    case securityGroup.LOAD_SELECTED_SG: {
      return {
        ...state,
        selectedSecurityGroupId: action.payload
      };
    }
    default: {
      return state;
    }
  }
}

export function formReducer(
  state = initialFormState,
  action: securityGroup.Actions
): FormState {
  switch (action.type) {
    default: {
      return state;
    }
  }
}

export const getSecurityGroupsState = createFeatureSelector<SecurityGroupsState>(
  'securityGroups');

export const getSecurityGroupsEntitiesState = createSelector(
  getSecurityGroupsState,
  state => state.list
);

export const getSecurityGroupsFormState = createSelector(
  getSecurityGroupsState,
  state => state.form
);

export const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
} = adapter.getSelectors(getSecurityGroupsEntitiesState);

export const filters = createSelector(
  getSecurityGroupsEntitiesState,
  state => state.filters
);

export const viewMode = createSelector(
  getSecurityGroupsEntitiesState,
  state => state.filters.viewMode
);

export const getSelectedId = createSelector(
  getSecurityGroupsEntitiesState,
  state => state.selectedSecurityGroupId
);

export const getSelectedSecurityGroup = createSelector(
  getSecurityGroupsEntitiesState,
  getSelectedId,
  (state, selectedId) => state.entities[selectedId]
);

export const isListLoading = createSelector(
  getSecurityGroupsEntitiesState,
  state => state.loading
);

export const isFormLoading = createSelector(
  getSecurityGroupsFormState,
  state => state.loading
);

export const selectFilteredSecurityGroups = createSelector(
  selectAll,
  filters,
  (securityGroups, filter) => {
    const queryLower = filter.query ? filter.query.toLowerCase() : '';
    const queryFilter = (group: SecurityGroup) => !queryLower || group.name.toLowerCase()
      .includes(queryLower);

    const mode = filter.viewMode;
    const viewModeFilter = (group: SecurityGroup) => {
      if (mode === SecurityGroupViewMode.Templates) {
        return group.type === SecurityGroupType.PredefinedTemplate || group.type === SecurityGroupType.CustomTemplate;
      } else {
        return group.type === SecurityGroupType.Shared;
      }
    };

    return securityGroups.filter(group => queryFilter(group) && viewModeFilter(group));
  }
);


