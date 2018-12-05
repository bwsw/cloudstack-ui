import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as capabilityActions from './capabilities.actions';
import { Capabilities } from '../../../shared/models/capabilities.model';
import { create } from 'domain';

export interface CapabilitiesState {
  loading: boolean;
  capabilities: Capabilities;
}

export const capabilitiesReducers = {
  list: reducer,
};

export const initialState: CapabilitiesState = {
  loading: false,
  capabilities: null,
};

export function reducer(
  state = initialState,
  action: capabilityActions.Actions,
): CapabilitiesState {
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
        capabilities: action.payload,
      };
    }

    default: {
      return state;
    }
  }
}

export const getCapabilitiesState = createFeatureSelector<CapabilitiesState>('capabilities');

export const getCapabilities = createSelector(getCapabilitiesState, state => state.capabilities);

export const isLoading = createSelector(getCapabilitiesState, state => state.loading);

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
  capabilities => capabilities && capabilities.customdiskofferingmaxsize,
);
