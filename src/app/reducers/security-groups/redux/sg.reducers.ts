import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { SecurityGroupViewMode } from '../../../security-group/sg-view-mode';
import {
  getType,
  isDefaultSecurityGroup,
  isSecurityGroupNative,
  SecurityGroup,
  SecurityGroupType,
} from '../../../security-group/sg.model';

import * as fromAccounts from '../../accounts/redux/accounts.reducers';
import * as fromAuth from '../../auth/redux/auth.reducers';
import * as securityGroupActions from './sg.actions';
import { Utils } from '../../../shared/services/utils/utils.service';
import { configSelectors, UserTagsSelectors } from '../../../root-store';

export interface State {
  list: ListState;
  form: FormState;
}

export interface ListState extends EntityState<SecurityGroup> {
  filters: {
    viewMode: string;
    selectedAccountIds: string[];
    query: string;
    selectOrphanSG: boolean;
  };
  loading: boolean;
  selectedSecurityGroupId: string | null;
}

export const adapter: EntityAdapter<SecurityGroup> = createEntityAdapter<SecurityGroup>({
  selectId: (item: SecurityGroup) => item.id,
  sortComparer: Utils.sortByName,
});

const initialListState: ListState = adapter.getInitialState({
  filters: {
    query: '',
    selectedAccountIds: [],
    viewMode: SecurityGroupViewMode.Templates,
    selectOrphanSG: false,
  },
  loading: false,
  selectedSecurityGroupId: null,
});

export interface FormState {
  loading: boolean;
  error: object;
}

const initialFormState: FormState = {
  loading: false,
  error: null,
};

export interface SecurityGroupsState {
  list: ListState;
  form: FormState;
}

export const securityGroupReducers = {
  list: listReducer,
  form: formReducer,
};

export function listReducer(
  state = initialListState,
  action: securityGroupActions.Actions,
): ListState {
  switch (action.type) {
    case securityGroupActions.LOAD_SECURITY_GROUP_REQUEST: {
      return {
        ...state,
        loading: true,
      };
    }
    case securityGroupActions.SECURITY_GROUP_FILTER_UPDATE: {
      return {
        ...state,
        filters: {
          ...state.filters,
          ...action.payload,
        },
      };
    }
    case securityGroupActions.LOAD_SECURITY_GROUP_RESPONSE: {
      return adapter.addAll([...action.payload], { ...state, loading: false });
    }
    case securityGroupActions.LOAD_SELECTED_SECURITY_GROUP: {
      return {
        ...state,
        selectedSecurityGroupId: action.payload,
      };
    }
    case securityGroupActions.CREATE_SECURITY_GROUP_SUCCESS: {
      return adapter.addOne(action.payload, state);
    }
    case securityGroupActions.CREATE_SECURITY_GROUPS_SUCCESS: {
      return adapter.addMany(action.payload, state);
    }
    case securityGroupActions.DELETE_SECURITY_GROUP_SUCCESS: {
      return adapter.removeOne(action.payload.id, state);
    }
    case securityGroupActions.UPDATE_SECURITY_GROUP: {
      return adapter.updateOne({ id: action.payload.id, changes: action.payload }, state);
    }
    case securityGroupActions.CONVERT_SECURITY_GROUP_SUCCESS: {
      return adapter.updateOne({ id: action.payload.id, changes: action.payload }, state);
    }
    default: {
      return state;
    }
  }
}

export function formReducer(
  state = initialFormState,
  action: securityGroupActions.Actions,
): FormState {
  switch (action.type) {
    case securityGroupActions.CREATE_SECURITY_GROUP:
    case securityGroupActions.DELETE_SECURITY_GROUP: {
      return {
        ...state,
        loading: true,
      };
    }
    case securityGroupActions.CREATE_SECURITY_GROUP_SUCCESS:
    case securityGroupActions.CREATE_SECURITY_GROUP_ERROR:
    case securityGroupActions.DELETE_SECURITY_GROUP_SUCCESS:
    case securityGroupActions.DELETE_SECURITY_GROUP_ERROR: {
      return {
        ...state,
        loading: false,
      };
    }
    default: {
      return state;
    }
  }
}

export const getSecurityGroupsState = createFeatureSelector<SecurityGroupsState>('securityGroups');

export const getSecurityGroupsEntitiesState = createSelector(
  getSecurityGroupsState,
  state => state.list,
);

export const getSecurityGroupsFormState = createSelector(
  getSecurityGroupsState,
  state => state.form,
);

export const { selectIds, selectEntities, selectAll, selectTotal } = adapter.getSelectors(
  getSecurityGroupsEntitiesState,
);

export const filters = createSelector(getSecurityGroupsEntitiesState, state => state.filters);

export const viewMode = createSelector(filters, state => state.viewMode);

export const query = createSelector(filters, state => state.query);

export const selectOrphanSG = createSelector(filters, state => state.selectOrphanSG);

export const filterSelectedAccountIds = createSelector(filters, state => state.selectedAccountIds);

export const getSelectedId = createSelector(
  getSecurityGroupsEntitiesState,
  state => state.selectedSecurityGroupId,
);

export const getSelectedSecurityGroup = createSelector(
  getSecurityGroupsEntitiesState,
  getSelectedId,
  (state, selectedId) => state.entities[selectedId],
);

export const isListLoading = createSelector(getSecurityGroupsEntitiesState, state => state.loading);

export const isFormLoading = createSelector(getSecurityGroupsFormState, state => state.loading);

const selectDefaultSecurityGroupName = createSelector(
  configSelectors.get('defaultSecurityGroupName'),
  UserTagsSelectors.getInterfaceLanguage,
  (names, lang) => {
    return names[lang];
  },
);

export const selectFilteredSecurityGroups = createSelector(
  selectAll,
  filters,
  fromAccounts.selectAll,
  selectDefaultSecurityGroupName,
  (securityGroups, filter, accounts, defaultSecurityGroupName) => {
    const mode = filter.viewMode;
    const queryLower = filter.query ? filter.query.toLowerCase() : '';
    const queryFilter = (group: SecurityGroup) =>
      !queryLower || group.name.toLowerCase().includes(queryLower);

    const selectedAccounts = accounts.filter(account =>
      filter.selectedAccountIds.find(id => id === account.id),
    );
    const accountsMap = selectedAccounts.reduce((m, i) => ({ ...m, [i.name]: i }), {});
    const domainsMap = selectedAccounts.reduce((m, i) => ({ ...m, [i.domainid]: i }), {});

    const selectedAccountIdsFilter = group =>
      !filter.selectedAccountIds.length ||
      group.type === SecurityGroupType.PredefinedTemplate ||
      (accountsMap[group.account] && domainsMap[group.domainid]);

    const viewModeFilter = (group: SecurityGroup) => {
      if (mode === SecurityGroupViewMode.Templates) {
        return (
          getType(group) === SecurityGroupType.PredefinedTemplate ||
          getType(group) === SecurityGroupType.CustomTemplate
        );
      }
      if (mode === SecurityGroupViewMode.Shared) {
        return getType(group) === SecurityGroupType.Shared;
      }
      if (mode === SecurityGroupViewMode.Private) {
        return getType(group) === SecurityGroupType.Private;
      }
    };

    const isOrphan = (group: SecurityGroup) =>
      filter.selectOrphanSG &&
      mode === SecurityGroupViewMode.Private &&
      isSecurityGroupNative(group)
        ? group.virtualmachineids.length === 0
        : true;

    const renameDefaultSG = (securityGroup: SecurityGroup) => {
      return isDefaultSecurityGroup(securityGroup)
        ? { ...securityGroup, name: defaultSecurityGroupName }
        : securityGroup;
    };

    return securityGroups
      .map(renameDefaultSG)
      .filter(
        group =>
          queryFilter(group) &&
          viewModeFilter(group) &&
          selectedAccountIdsFilter(group) &&
          isOrphan(group),
      );
  },
);

export const selectSecurityGroupsForVmCreation = createSelector(
  selectAll,
  fromAuth.getUserAccount,
  selectDefaultSecurityGroupName,
  (securityGroups, account, defaultSecurityGroupName) => {
    const accountFilter = (securityGroup: SecurityGroup) =>
      account && isSecurityGroupNative(securityGroup) && securityGroup.account === account.name;
    const onlySharedFilter = (securityGroup: SecurityGroup) =>
      getType(securityGroup) === SecurityGroupType.Shared;
    const renameDefaultSG = (securityGroup: SecurityGroup) => {
      return isDefaultSecurityGroup(securityGroup)
        ? { ...securityGroup, name: defaultSecurityGroupName }
        : securityGroup;
    };
    return securityGroups
      .map(renameDefaultSG)
      .filter(securityGroup => accountFilter(securityGroup) && onlySharedFilter(securityGroup));
  },
);

export const selectPredefinedSecurityGroups = createSelector(
  selectAll,
  (securityGroups: SecurityGroup[]) =>
    securityGroups.filter(securityGroup => securityGroup.preselected),
);

export const selectDefaultSecurityGroup = createSelector(
  selectAll,
  selectDefaultSecurityGroupName,
  fromAuth.getUserAccount,
  (securityGroups, defaultSecurityGroupName, user) => {
    const defaultGroup = securityGroups.find(
      (sg: SecurityGroup) =>
        isSecurityGroupNative(sg) && sg.account === user.name && sg.name === 'default',
    );
    return { ...defaultGroup, name: defaultSecurityGroupName };
  },
);
