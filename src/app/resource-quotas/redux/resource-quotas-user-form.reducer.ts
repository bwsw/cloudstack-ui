import { createFeatureSelector, createSelector } from '@ngrx/store';
import { default as update } from 'immutability-helper';
import * as resourceQuotasActions from './resource-quotas.actions';
import * as fromAccounts from '../../reducers/accounts/redux/accounts.reducers';
import { getTotalResources } from '../../shared/models';
import { convertFromLimitToQuotaMeasurement } from '../models/resource-quota.model';

const pickBy = require('lodash/pickBy');
const mapValues = require('lodash/mapValues');

export interface ResourceQuotasUserFormState {
  quotas: {
    [resourceType: number]: {
      minimum: number;
      maximum: number;
    };
  };
  limits: {
    [resourceType: number]: number;
  };
  isSaving: boolean;
}

export const initialState = {
  quotas: {},
  limits: {},
  isSaving: false,
};

export function resourceQuotasUserFormReducer(
  state = initialState,
  action: resourceQuotasActions.Actions,
): ResourceQuotasUserFormState {
  switch (action.type) {
    case resourceQuotasActions.ResourceQuotasActionTypes.UPDATE_USER_FORM_FIELD: {
      const resourceType = action.payload.resourceType;
      return {
        ...state,
        limits: {
          ...state.limits,
          [resourceType]: action.payload.limit,
        },
      };
    }

    case resourceQuotasActions.ResourceQuotasActionTypes.UPDATE_USER_FORM_QUOTAS: {
      return update(state, {
        $merge: {
          quotas: action.payload,
        },
      });
    }

    case resourceQuotasActions.ResourceQuotasActionTypes.UPDATE_USER_FORM_LIMITS: {
      return update(state, {
        $merge: {
          // limits: mapValues(action.payload, 'max'),
          limits: mapValues(action.payload, (value, key) => {
            return convertFromLimitToQuotaMeasurement(+key, value.max);
          }),
        },
      });
    }
    case resourceQuotasActions.ResourceQuotasActionTypes.UPDATE_RESOURCE_LIMITS_REQUEST: {
      return {
        ...state,
        isSaving: true,
      };
    }

    case resourceQuotasActions.ResourceQuotasActionTypes.UPDATE_RESOURCE_LIMITS_RESPONSE:
    case resourceQuotasActions.ResourceQuotasActionTypes.UPDATE_RESOURCE_LIMITS_ERROR: {
      return {
        ...state,
        isSaving: false,
      };
    }

    default:
      return state;
  }
}

export const getResourceQuotasUserFormState = createFeatureSelector<ResourceQuotasUserFormState>(
  'resourceQuotasUserForm',
);

export const getUserResourceQuotas = createSelector(
  getResourceQuotasUserFormState,
  fromAccounts.selectUserAccount,
  (state, account) => {
    const totalResources = getTotalResources(account);
    const finiteQuotas = pickBy(
      state.quotas,
      bound => bound.minimum !== -1 && bound.maximum !== -1,
    );
    const quotasWithAdjustedMinimum = mapValues(finiteQuotas, (value, key) => {
      const resourceValue = convertFromLimitToQuotaMeasurement(+key, totalResources[key]);
      return {
        minimum: Math.max(Math.ceil(resourceValue), value.minimum),
        maximum: Math.max(Math.ceil(resourceValue), value.maximum),
      };
    });
    return pickBy(quotasWithAdjustedMinimum, bound => bound.maximum >= bound.minimum);
  },
);

export const getUserResourceLimits = createSelector(
  getResourceQuotasUserFormState,
  state => state.limits,
);

export const isUserResourceLimitsSaving = createSelector(
  getResourceQuotasUserFormState,
  state => state.isSaving,
);
