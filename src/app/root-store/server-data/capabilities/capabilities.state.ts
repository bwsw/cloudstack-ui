import { Capabilities } from '../../../shared/models';

export interface CapabilitiesState {
  loading: boolean;
  capabilities: Capabilities;
}

export const initialState: CapabilitiesState = {
  loading: false,
  capabilities: null,
};
