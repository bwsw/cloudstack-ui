import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { SecurityGroupViewMode } from '../../../security-group/sg-view-mode';
import { getType, SecurityGroup, SecurityGroupType } from '../../../security-group/sg.model';

import * as fromAccounts from '../../accounts/redux/accounts.reducers';
import * as fromAuth from '../../auth/redux/auth.reducers';
import * as securityGroup from './sg.actions';
import { Utils } from '../../../shared/services/utils/utils.service';


export interface State {
  list: ListState,
  form: FormState
}

export interface ListState extends EntityState<SecurityGroup> {
  filters: {
    viewMode: string,
    selectedAccountIds: string[],
    query: string,
    selectOrphanSG: boolean
  },
  loading: boolean,
  selectedSecurityGroupId: string | null
}

export const adapter: EntityAdapter<SecurityGroup> = createEntityAdapter<SecurityGroup>({
  selectId: (item: SecurityGroup) => item.id,
  sortComparer: Utils.sortByName
});

const initialListState: ListState = adapter.getInitialState({
  filters: {
    query: '',
    selectedAccountIds: [],
    viewMode: SecurityGroupViewMode.Templates,
    selectOrphanSG: false
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
    case securityGroup.LOAD_SECURITY_GROUP_REQUEST: {
      return {
        ...state,
        loading: true
      };
    }
    case securityGroup.SECURITY_GROUP_FILTER_UPDATE: {
      return {
        ...state,
        filters: {
          ...state.filters,
          ...action.payload
        }
      };
    }
    case securityGroup.LOAD_SECURITY_GROUP_RESPONSE: {
      return adapter.addAll([...action.payload], { ...state, loading: false });
    }
    case securityGroup.LOAD_SELECTED_SECURITY_GROUP: {
      return {
        ...state,
        selectedSecurityGroupId: action.payload
      };
    }
    case securityGroup.CREATE_SECURITY_GROUP_SUCCESS: {
      return adapter.addOne(action.payload, state);
    }
    case securityGroup.CREATE_SECURITY_GROUPS_SUCCESS: {
      return adapter.addMany(action.payload, state);
    }
    case securityGroup.DELETE_SECURITY_GROUP_SUCCESS: {
      return adapter.removeOne(action.payload.id, state);
    }
    case securityGroup.UPDATE_SECURITY_GROUP: {
      return adapter.updateOne({ id: action.payload.id, changes: action.payload }, state);
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
    case securityGroup.CREATE_SECURITY_GROUP:
    case securityGroup.DELETE_SECURITY_GROUP: {
      return {
        ...state,
        loading: true
      };
    }
    case securityGroup.CREATE_SECURITY_GROUP_SUCCESS:
    case securityGroup.CREATE_SECURITY_GROUP_ERROR:
    case securityGroup.DELETE_SECURITY_GROUP_SUCCESS:
    case securityGroup.DELETE_SECURITY_GROUP_ERROR: {
      return {
        ...state,
        loading: false
      };
    }
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
  filters,
  state => state.viewMode
);

export const query = createSelector(
  filters,
  state => state.query
);

export const selectOrphanSG = createSelector(
  filters,
  state => state.selectOrphanSG
);

export const filterSelectedAccountIds = createSelector(
  filters,
  state => state.selectedAccountIds
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
  fromAccounts.selectAll,
  (securityGroups, filter, accounts) => {
    const mode = filter.viewMode;
    const queryLower = filter.query ? filter.query.toLowerCase() : '';
    const queryFilter = (group: SecurityGroup) => !queryLower || group.name.toLowerCase()
      .includes(queryLower);

    const selectedAccounts = accounts.filter(
      account => filter.selectedAccountIds.find(id => id === account.id));
    const accountsMap = selectedAccounts.reduce((m, i) => ({ ...m, [i.name]: i }), {});
    const domainsMap = selectedAccounts.reduce((m, i) => ({ ...m, [i.domainid]: i }), {});

    const selectedAccountIdsFilter = group => !filter.selectedAccountIds.length ||
      group.type === SecurityGroupType.PredefinedTemplate ||
      (accountsMap[group.account] && domainsMap[group.domainid]);

    const viewModeFilter = (group: SecurityGroup) => {
      if (mode === SecurityGroupViewMode.Templates) {
        return getType(group) === SecurityGroupType.PredefinedTemplate
          || getType(group) === SecurityGroupType.CustomTemplate;
      } else if (mode === SecurityGroupViewMode.Shared) {
        return getType(group) === SecurityGroupType.Shared;
      } else if (mode === SecurityGroupViewMode.Private) {
        return getType(group) === SecurityGroupType.Private;
      }
    };

    const isOrphan = (group: SecurityGroup) => filter.selectOrphanSG && mode === SecurityGroupViewMode.Private
      ? group.virtualmachineids.length === 0
      : true;

    return securityGroups.filter(group => queryFilter(group)
      && viewModeFilter(group) && selectedAccountIdsFilter(group) && isOrphan(group));
  }
);

export const selectSecurityGroupsForVmCreation = createSelector(
  selectAll, fromAuth.getUserAccount, (securityGroups, account) => {
    const accountFilter = (securityGroup: SecurityGroup) => account && securityGroup.account === account.name;
    const onlySharedFilter = (securityGroup: SecurityGroup) =>
      getType(securityGroup) === SecurityGroupType.Shared;
    return securityGroups.filter((securityGroup) => accountFilter(securityGroup)
      && onlySharedFilter(securityGroup));
  });

export const selectPredefinedSecurityGroups = createSelector(
  selectAll,
  (securityGroups: SecurityGroup[]) => securityGroups.filter(
    securityGroup => securityGroup.preselected)
);

