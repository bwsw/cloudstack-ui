import { ConfigActionsUnion, ConfigActionTypes } from './config.actions';
import { Config } from '../../shared/models';
import { defaultConfig } from '../../core/config';

export interface ConfigState {
  config: Config;
  isLoaded: boolean;
}

export const initialState: ConfigState = {
  config: defaultConfig,
  isLoaded: false
};

export function reducer(state = initialState, action: ConfigActionsUnion) {
  switch (action.type) {
    case ConfigActionTypes.LoadConfigSuccess: {
      return {
        config: action.payload.config,
        isLoaded: true
      }
    }

    case ConfigActionTypes.LoadConfigError: {
      return {
        config: defaultConfig,
        isLoaded: true
      }
    }

    default: {
      return state;
    }
  }
}
