import { createFeatureSelector, createSelector } from '@ngrx/store';
import { Capabilities } from '../../../shared/models';
import { capabilitiesFeatureName } from './capabilities.reducers';
import { CapabilitiesState } from './capabilities.state';

export const getCapabilitiesState = createFeatureSelector<CapabilitiesState>(
  capabilitiesFeatureName,
);

export const getCapabilities = createSelector(
  getCapabilitiesState,
  (state): Capabilities => state.capabilities,
);

export const isLoading = createSelector(
  getCapabilitiesState,
  state => state.loading,
);

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
