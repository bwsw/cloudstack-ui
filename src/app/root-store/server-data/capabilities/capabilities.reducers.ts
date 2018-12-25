import * as capabilityActions from './capabilities.actions';
import { CapabilitiesState, initialState } from './capabilities.state';

export const capabilitiesFeatureName = 'capabilities';

export function reducer(
  state = initialState,
  action: capabilityActions.Actions,
): CapabilitiesState {
  switch (action.type) {
    case capabilityActions.ActionTypes.LoadCapabilities: {
      return {
        ...state,
        loading: true,
      };
    }

    case capabilityActions.ActionTypes.LoadCapabilitiesSuccess: {
      return {
        loading: false,
        capabilities: action.payload,
      };
    }

    case capabilityActions.ActionTypes.LoadCapabilitiesError: {
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
