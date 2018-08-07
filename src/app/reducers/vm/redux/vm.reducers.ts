import { VirtualMachineTagKeys } from '../../../shared/services/tags/vm-tag-keys';
import { noGroup } from '../../../vm/vm-filter/vm-filter.component';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { VirtualMachine } from '../../../vm/shared/vm.model';
import { InstanceGroup, Tag } from '../../../shared/models';
import { VmCreationSecurityGroupData } from '../../../vm/vm-creation/security-group/vm-creation-security-group-data';
import { Rules } from '../../../shared/components/security-group-builder/rules';
import { Utils } from '../../../shared/services/utils/utils.service';
import { VmCreationState } from '../../../vm/vm-creation/data/vm-creation-state';
import { KeyboardLayout } from '../../../vm/vm-creation/keyboards/keyboards.component';
// tslint:disable-next-line
import {
  ProgressLoggerMessage,
  ProgressLoggerMessageStatus
} from '../../../shared/components/progress-logger/progress-logger-message/progress-logger-message';
import { NotSelectedSshKey } from '../../../vm/vm-creation/ssh-key-selector/ssh-key-selector.component';

import * as fromAccounts from '../../accounts/redux/accounts.reducers';
import * as vmActions from './vm.actions';
import * as fromSGroup from '../../security-groups/redux/sg.reducers';
import * as affinityGroupActions from '../../affinity-groups/redux/affinity-groups.actions';

/**
 * @ngrx/entity provides a predefined interface for handling
 * a structured dictionary of records. This interface
 * includes an array of ids, and a dictionary of the provided
 * model type by id. This interface is extended to include
 * any additional interface properties.
 */
export interface State extends EntityState<VirtualMachine> {
  loading: boolean,
  selectedVMId: string,
  filters: {
    selectedZoneIds: string[],
    selectedGroupNames: string[],
    selectedStates: string[],
    selectedAccountIds: string[],
    selectedGroupings: any[],
    query: string,
  },
  attachmentFilters: {
    account: string,
    domainId: string,
  }
}

export interface FormState {
  loading: boolean,
  showOverlay: boolean,
  deploymentInProgress: boolean,
  enoughResources: boolean,
  insufficientResources: Array<string>,
  loggerStageList: Array<ProgressLoggerMessage>,
  deployedVm: VirtualMachine,
  state: VmCreationState
}

export interface VirtualMachineState {
  list: State;
  form: FormState;
}

export const virtualMachineReducers = {
  list: listReducer,
  form: formReducer
};

/**
 * createEntityAdapter creates many an object of helper
 * functions for single or multiple operations
 * against the dictionary of records. The configuration
 * object takes a record id selector function and
 * a sortComparer option which is set to a compare
 * function if the records are to be sorted.
 */
export const adapter: EntityAdapter<VirtualMachine> = createEntityAdapter<VirtualMachine>(
  {
    selectId: (item: VirtualMachine) => item.id,
    sortComparer: Utils.sortByName
  });

/** getInitialState returns the default initial state
 * for the generated entity state. Initial state
 * additional properties can also be defined.
 */
export const initialListState: State = adapter.getInitialState({
  loading: false,
  selectedVMId: null,
  filters: {
    selectedZoneIds: [],
    selectedGroupNames: [],
    selectedStates: [],
    selectedAccountIds: [],
    selectedGroupings: [],
    query: '',
  },
  attachmentFilters: {
    account: '',
    domainId: '',
  }
});

export function listReducer(
  state = initialListState,
  action: vmActions.Actions
): State {
  switch (action.type) {
    case vmActions.LOAD_VMS_REQUEST: {
      return {
        ...state,
        loading: true
      };
    }

    case vmActions.VIRTUAL_MACHINE_LOADED: {
      const vm = action.payload.vm;
      return adapter.updateOne({ id: vm.id, changes: vm }, state);
    }

    case vmActions.VM_FILTER_UPDATE: {
      return {
        ...state,
        filters: {
          ...state.filters,
          ...action.payload
        }
      };
    }

    case vmActions.VM_ATTACHMENT_FILTER_UPDATE: {
      return {
        ...state,
        attachmentFilters: {
          ...state.attachmentFilters,
          ...action.payload
        }
      };
    }

    case vmActions.LOAD_SELECTED_VM: {
      return {
        ...state,
        selectedVMId: action.payload
      };
    }

    case vmActions.LOAD_VMS_RESPONSE: {
      return {
        ...adapter.addAll([...action.payload], state),
        loading: false
      };
    }

    case vmActions.UPDATE_VM: {
      return {
        ...adapter.updateOne({ id: action.payload.id, changes: action.payload }, state),
      };
    }

    case vmActions.REPLACE_VM: {
      const newState = adapter.removeOne(action.payload.id, state);
      return {
        ...adapter.addOne(action.payload, newState),
      };
    }

    case vmActions.VM_DEPLOYMENT_REQUEST_SUCCESS: {
      return {
        ...adapter.addOne(action.payload, state),
      };
    }

    case vmActions.EXPUNGE_VM_SUCCESS: {
      return {
        ...adapter.removeOne(action.payload.id, state),
      };
    }

    case vmActions.SAVE_VM_PASSWORD_SUCCESS: {
      const tagsWithoutPassword: Tag[] = action.payload.vm.tags
        .filter((tag: Tag) => tag.key !== VirtualMachineTagKeys.passwordTag);
      const passwordTag: Tag = {
        key: VirtualMachineTagKeys.passwordTag,
        value: action.payload.password
      };
      const tagsWithNewPassword: Tag[] = [...tagsWithoutPassword, passwordTag];
      return {
        ...adapter.updateOne({ id: action.payload.vm.id, changes: { tags: tagsWithNewPassword } }, state)
      }
    }

    default: {
      return state;
    }
  }
}

export const getVMsState = createFeatureSelector<VirtualMachineState>('virtualMachines');

export const getVMsEntitiesState = createSelector(
  getVMsState,
  state => state.list
);

export const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
} = adapter.getSelectors(getVMsEntitiesState);

export const isLoading = createSelector(
  getVMsEntitiesState,
  state => state.loading
);

export const getSelectedId = createSelector(
  getVMsEntitiesState,
  state => state.selectedVMId
);

export const getSelectedVM = createSelector(
  getVMsState,
  getSelectedId,
  (state, selectedId) => state.list.entities[selectedId]
);

export const filters = createSelector(
  getVMsEntitiesState,
  state => state.filters
);

export const attachmentFilters = createSelector(
  getVMsEntitiesState,
  state => state.attachmentFilters
);

export const filterQuery = createSelector(
  filters,
  state => state.query
);


export const filterSelectedZoneIds = createSelector(
  filters,
  state => state.selectedZoneIds
);

export const filterSelectedStates = createSelector(
  filters,
  state => state.selectedStates
);

export const filterSelectedGroupNames = createSelector(
  filters,
  state => state.selectedGroupNames
);

export const filterSelectedAccountIds = createSelector(
  filters,
  state => state.selectedAccountIds
);

export const filterSelectedGroupings = createSelector(
  filters,
  state => state.selectedGroupings
);

export const selectVmGroups = createSelector(
  selectAll,
  (vms) => {
    const groups = vms.reduce((groupsMap, vm) => {
      const group = vm.tags.find(tag => tag.key === VirtualMachineTagKeys.group);

      if (group && group.value && !groupsMap[group.value]) {
        groupsMap[group.value] = new InstanceGroup(group.value);
      }
      return groupsMap;
    }, {});
    return groups ? Object.values(groups) : [];
  }
);

export const getUsingSGVMs = createSelector(
  selectAll,
  fromSGroup.getSelectedId,
  (vms, sGroupId) => {
    const sGroupFilter = vm => vm.securityGroup.find(group => group.id === sGroupId);
    return vms.filter(vm => sGroupFilter(vm));
  }
);

export const getAttachmentVMs = createSelector(
  selectAll,
  attachmentFilters,
  (vms, filter) => {
    const accountFilter =
      vm => (vm.account === filter.account && vm.domainid === filter.domainId);

    return vms.filter(vm => accountFilter(vm));
  }
);

export const selectFilteredVMs = createSelector(
  selectAll,
  filterQuery,
  filterSelectedStates,
  filterSelectedGroupNames,
  filterSelectedZoneIds,
  filterSelectedAccountIds,
  fromAccounts.selectAll,
  (
    vms,
    query,
    selectedStates,
    selectedGroupNames,
    selectedZoneIds,
    selectedAccountIds,
    accounts
  ) => {
    const queryLower = query && query.toLowerCase();
    const statesMap = selectedStates.reduce((m, i) => ({ ...m, [i]: i }), {});
    const zoneIdsMap = selectedZoneIds.reduce((m, i) => ({ ...m, [i]: i }), {});
    const groupNamesMap = selectedGroupNames.reduce((m, i) => ({ ...m, [i]: i }), {});

    const selectedAccounts = accounts.filter(
      account => selectedAccountIds.find(id => id === account.id));
    const accountsMap = selectedAccounts.reduce((m, i) => ({ ...m, [i.name]: i }), {});
    const domainsMap = selectedAccounts.reduce((m, i) => ({ ...m, [i.domainid]: i }), {});

    const queryFilter = vm => !query || vm.name.toLowerCase().includes(queryLower);

    const selectedStatesFilter = vm => !selectedStates.length || !!statesMap[vm.state];

    const selectedGroupNamesFilter = vm => !selectedGroupNames.length ||
      (!vm.instanceGroup && groupNamesMap[noGroup]) || (vm.instanceGroup && groupNamesMap[vm.instanceGroup.name]);

    const selectedZoneIdsFilter =
      vm => !selectedZoneIds.length || !!zoneIdsMap[vm.zoneId];

    const selectedAccountIdsFilter = vm => !selectedAccountIds.length ||
      (accountsMap[vm.account] && domainsMap[vm.domainid]);

    return vms.filter(vm => {
      return selectedStatesFilter(vm)
        && queryFilter(vm)
        && selectedGroupNamesFilter(vm)
        && selectedZoneIdsFilter(vm)
        && selectedAccountIdsFilter(vm);
    });
  }
);

export const initialFormState: FormState = {
  loading: false,
  showOverlay: false,
  deploymentInProgress: false,
  enoughResources: false,
  insufficientResources: [],
  loggerStageList: [],
  deployedVm: null,
  state: {
    affinityGroup: null,
    affinityGroupNames: [],
    diskOffering: null,
    displayName: '',
    doStartVm: true,
    instanceGroup: null,
    keyboard: KeyboardLayout.us,
    rootDiskSize: null,
    rootDiskMinSize: 0,
    securityGroupData: VmCreationSecurityGroupData.fromRules(new Rules()),
    serviceOffering: null,
    sshKeyPair: NotSelectedSshKey,
    template: null,
    zone: null,
    agreement: false
  }
};

export function formReducer(
  state = initialFormState,
  action: vmActions.Actions | affinityGroupActions.Actions
): FormState {
  switch (action.type) {
    case vmActions.VM_FORM_INIT: {
      return { ...state, loading: true };
    }
    case vmActions.VM_FORM_CLEAN: {
      return { ...initialFormState };
    }
    case vmActions.VM_FORM_UPDATE: {
      return { ...state, state: { ...state.state, ...action.payload } };
    }
    case vmActions.VM_CREATION_STATE_UPDATE: {
      return { ...state, ...action.payload };
    }
    case vmActions.VM_CREATION_ENOUGH_RESOURCE_STATE_UPDATE: {
      return { ...state, enoughResources: action.payload, loading: false };
    }
    case vmActions.VM_DEPLOYMENT_REQUEST: {
      return {
        ...state,
        showOverlay: true,
        deploymentInProgress: true
      };
    }
    case vmActions.VM_DEPLOYMENT_INIT_ACTION_LIST: {
      return { ...state, loggerStageList: [...action.payload] };
    }
    case vmActions.VM_DEPLOYMENT_ADD_LOGGER_MESSAGE: {
      return { ...state, loggerStageList: [...state.loggerStageList, action.payload] };
    }
    case vmActions.VM_DEPLOYMENT_UPDATE_LOGGER_MESSAGE: {
      const messages = [...state.loggerStageList].map(message => {
        if (message.text != null && message.text === action.payload.messageText) {
          return Object.assign({}, message, action.payload.data);
        } else {
          return message;
        }
      });

      return { ...state, loggerStageList: [...messages] };
    }
    case vmActions.VM_DEPLOYMENT_REQUEST_SUCCESS: {
      return {
        ...state,
        deployedVm: action.payload,
        deploymentInProgress: false
      };
    }
    case vmActions.VM_DEPLOYMENT_REQUEST_ERROR: {
      const messages = [...state.loggerStageList].map(message => {
        if (message.status && message.status.includes(ProgressLoggerMessageStatus.InProgress)) {
          return Object.assign({}, message, { status: [ProgressLoggerMessageStatus.Error] });
        } else {
          return message;
        }
      });

      return { ...state, loggerStageList: [...messages], deploymentInProgress: false };
    }
    case vmActions.VM_DEPLOYMENT_COPY_TAGS: {
      return {
        ...state,
        deployedVm: <VirtualMachine>({ ...state.deployedVm, tags: action.payload })
      };
    }
    case affinityGroupActions.LOAD_AFFINITY_GROUPS_RESPONSE: {
      const names = action.payload.map(_ => _.name);
      return { ...state, state: { ...state.state, affinityGroupNames: names } };
    }
    default: {
      return state;
    }
  }
}

export const getVmForm = createSelector(
  getVMsState,
  state => state.form
);
export const getVmFormState = createSelector(
  getVMsState,
  state => state.form.state
);

export const formIsLoading = createSelector(
  getVmForm,
  state => state.loading
);

export const enoughResources = createSelector(
  getVmForm,
  state => state.enoughResources
);

export const insufficientResources = createSelector(
  getVmForm,
  state => state.insufficientResources
);

export const deploymentInProgress = createSelector(
  getVmForm,
  state => state.deploymentInProgress
);

export const loggerStageList = createSelector(
  getVmForm,
  state => state.loggerStageList
);

export const showOverlay = createSelector(
  getVmForm,
  state => state.showOverlay
);

export const getDeployedVM = createSelector(
  getVmForm,
  state => state.deployedVm
);

export const getVmCreationZoneId = createSelector(
  getVmFormState,
  state => state.zone && state.zone.id
);

