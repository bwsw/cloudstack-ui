import { createFeatureSelector, createSelector } from '@ngrx/store';
import { default as update } from 'immutability-helper';
import * as resourceQuotasActions from './resource-quotas.actions';

const omit = require('lodash/omit');

export interface ResourceQuotasAdminFormState {
  form: {
    [resourceType: number]: {
      minimum: number;
      maximum: number;
    };
  };
  isSaving: boolean;
}

export const initialState = {
  form: {},
  isSaving: false,
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
        ...state,
        form: action.payload,
      };
    }

    case resourceQuotasActions.ResourceQuotasActionTypes.UPDATE_RESOURCE_QUOTAS_REQUEST: {
      return {
        ...state,
        isSaving: true,
      };
    }

    case resourceQuotasActions.ResourceQuotasActionTypes.UPDATE_RESOURCE_QUOTAS_ERROR:
    case resourceQuotasActions.ResourceQuotasActionTypes.UPDATE_RESOURCE_QUOTAS_RESPONSE: {
      return {
        ...state,
        isSaving: false,
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

export const isAdminResourceQuotasSaving = createSelector(
  getResourceQuotasAdminFormState,
  state => state.isSaving,
);
