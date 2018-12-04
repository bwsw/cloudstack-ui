import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as capabilities from './capabilities.actions';
import { Capabilities } from '../../../shared/models/capabilities.model';

export interface CapabilitiesState {
  loading: boolean;
  capabilities: Capabilities;
}

export const capabilitiesReducers = {
  list: reducer,
};

export const initialState = {
  loading: false,
  capabilities: null,
};

export function reducer(state = initialState, action: capabilities.Actions): State {
  switch (action.type) {
    case capabilities.ActionTypes.LOAD_CAPABILITIES_REQUEST: {
      return {
        ...state,
        loading: true,
      };
    }

    case capabilities.ActionTypes.LOAD_CAPABILITIES_RESPONSE: {
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
