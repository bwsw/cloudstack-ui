import { createFeatureSelector, createSelector } from '@ngrx/store';
const omit = require('lodash/omit');
import { default as update } from 'immutability-helper';
import * as resourceQuotasActions from './resource-quotas.actions';

export interface ResourceQuotasAdminFormState {
  form: {
    [resourceType: number]: {
      minimum: number;
      maximum: number;
    };
  };
}

export const initialState = {
  form: {},
};

export function resourceQuotasAdminFormReducer(
  state = initialState,
  action: resourceQuotasActions.Actions,
): ResourceQuotasAdminFormState {
  switch (action.type) {
    case resourceQuotasActions.ResourceQuotasActionTypes.UPDATE_ADMIN_FORM_FIELD: {
      const resourceType = action.payload.resourceType;

      return update(state, {
        form: {
          [resourceType]: {
            $merge: omit(action.payload, 'resourceType'),
          },
        },
      });
    }

    case resourceQuotasActions.ResourceQuotasActionTypes.UPDATE_ADMIN_FORM: {
      return {
        form: action.payload,
      };
    }

    default:
      return state;
  }
}

export const getResourceQuotasAdminFormState = createFeatureSelector<ResourceQuotasAdminFormState>(
  'resourceQuotasAdminForm',
);

export const getAdminResourceQuotasForm = createSelector(
  getResourceQuotasAdminFormState,
  state => state.form,
);
