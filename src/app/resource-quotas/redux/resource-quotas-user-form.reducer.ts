import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as omit from 'lodash/omit';
import * as pickBy from 'lodash/pickBy';
import { default as update } from 'immutability-helper';
import * as resourceQuotasActions from './resource-quotas.actions';

export interface ResourceQuotasUserFormState {
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

export function resourceQuotasUserFormReducer(
  state = initialState,
  action: resourceQuotasActions.Actions,
): ResourceQuotasUserFormState {
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

export const getResourceQuotasUserFormState = createFeatureSelector<ResourceQuotasUserFormState>(
  'resourceQuotasUserForm',
);

export const getUserResourceQuotasForm = createSelector(
  getResourceQuotasUserFormState,
  state => pickBy(state.form, bound => bound.minimum !== -1 && bound.maximum !== -1),
);
