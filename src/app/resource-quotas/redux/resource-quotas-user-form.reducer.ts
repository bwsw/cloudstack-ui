import { createFeatureSelector, createSelector } from '@ngrx/store';
import { default as update } from 'immutability-helper';
import * as resourceQuotasActions from './resource-quotas.actions';
import * as fromAccounts from '../../reducers/accounts/redux/accounts.reducers';
import { getTotalResources } from '../../shared/models';

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
}

export const initialState = {
  quotas: {},
  limits: {},
};

export function resourceQuotasUserFormReducer(
  state = initialState,
  action: resourceQuotasActions.Actions,
): ResourceQuotasUserFormState {
  switch (action.type) {
    case resourceQuotasActions.ResourceQuotasActionTypes.UPDATE_USER_FORM_FIELD: {
      const resourceType = action.payload.resourceType;
      return {
        quotas: state.quotas,
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
          limits: mapValues(action.payload, 'max'),
        },
      });
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
      const minimum = Math.max(Math.ceil(totalResources[key]), value.minimum);
      const maximum = value.maximum;
      if (maximum < minimum) {
        return {
          minimum: maximum,
          maximum: minimum,
        };
      }
      return {
        minimum,
        maximum,
      };
    });

    return pickBy(quotasWithAdjustedMinimum, bound => bound.maximum >= bound.minimum);
  },
);

export const getUserResourceLimits = createSelector(
  getResourceQuotasUserFormState,
  state => state.limits,
);
