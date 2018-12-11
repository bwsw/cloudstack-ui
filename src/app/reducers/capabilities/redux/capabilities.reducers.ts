import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as capabilityActions from './capabilities.actions';
import { Capabilities } from '../../../shared/models';

export interface State {
  loading: boolean;
  loaded: boolean;
  capabilities: Capabilities;
}

export interface CapabilitiesState {
  list: State;
}

export const capabilitiesReducers = {
  list: reducer,
};

export const initialState: State = {
  loading: false,
  loaded: false,
  capabilities: null,
};

export function reducer(state = initialState, action: capabilityActions.Actions): State {
  switch (action.type) {
    case capabilityActions.ActionTypes.LOAD_CAPABILITIES_REQUEST: {
      return {
        ...state,
        loading: true,
      };
    }

    case capabilityActions.ActionTypes.LOAD_CAPABILITIES_RESPONSE: {
      return {
        loading: false,
        loaded: true,
        capabilities: action.payload,
      };
    }

    default: {
      return state;
    }
  }
}

export const getCapabilitiesState = createFeatureSelector<CapabilitiesState>('capabilities');

export const getCapabilities = createSelector(
  getCapabilitiesState,
  (state): Capabilities => state.list.capabilities,
);

export const isLoading = createSelector(getCapabilitiesState, state => state.list.loading);

export const isLoaded = createSelector(getCapabilitiesState, state => state.list.loaded);

export const getIsAllowedToViewDestroyedVms = createSelector(
  getCapabilities,
  capabilities => !!capabilities && capabilities.allowuserviewdestroyedvm,
);

export const getCanExpungeOrRecoverVm = createSelector(
  getCapabilities,
  capabilities => !!capabilities && capabilities.allowuserexpungerecovervm,
);

export const getIsSecurityGroupEnabled = createSelector(
  getCapabilities,
  capabilities => !!capabilities && capabilities.securitygroupsenabled,
);

export const getCustomDiskOfferingMinSize = createSelector(
  getCapabilities,
  capabilities => !!capabilities && capabilities.customdiskofferingminsize,
);

export const getCustomDiskOfferingMaxSize = createSelector(
  getCapabilities,
  capabilities => !!capabilities && capabilities.customdiskofferingmaxsize,
);
