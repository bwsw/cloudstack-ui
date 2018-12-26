import { createFeatureSelector, createSelector } from '@ngrx/store';
import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { ResourceQuota } from '../models/resource-quota.model';
import * as resourceQuotasActions from './resource-quotas.actions';
import { resourceTypeNames } from '../utils/resource-type-names';

export interface ResourceQuotasState extends EntityState<ResourceQuota> {
  loading: boolean;
  errored: boolean;
}

export const adapter = createEntityAdapter<ResourceQuota>({
  selectId: resourceQuota => resourceQuota.id,
  sortComparer: false,
});

export const initialState: ResourceQuotasState = adapter.getInitialState({
  loading: false,
  errored: false,
});

export function resourceQuotasReducer(
  state = initialState,
  action: resourceQuotasActions.Actions,
): ResourceQuotasState {
  switch (action.type) {
    case resourceQuotasActions.ResourceQuotasActionTypes.LOAD_RESOURCE_QUOTAS_REQUEST: {
      return {
        ...adapter.removeAll(state),
        loading: true,
        errored: false,
      };
    }

    case resourceQuotasActions.ResourceQuotasActionTypes.LOAD_RESOURCE_QUOTAS_RESPONSE: {
      return {
        ...adapter.addAll([...action.payload], state),
        loading: false,
      };
    }

    case resourceQuotasActions.ResourceQuotasActionTypes.LOAD_RESOURCE_QUOTAS_ERROR: {
      return {
        ...state,
        loading: false,
        errored: true,
      };
    }

    default:
      return state;
  }
}

export const getResourceQuotasState = createFeatureSelector<ResourceQuotasState>('resourceQuotas');

export const { selectIds, selectEntities, selectAll, selectTotal } = adapter.getSelectors(
  getResourceQuotasState,
);

export const isLoading = createSelector(
  getResourceQuotasState,
  state => state.loading,
);

export const isErrorState = createSelector(
  getResourceQuotasState,
  state => state.errored,
);

export const getResourceQuotas = createSelector(
  selectEntities,
  (
    entities,
  ): {
    [resourceType: number]: {
      minimum: number;
      maximum: number;
    };
  } => {
    const resourceTypes = Array.from(Array(resourceTypeNames.length).keys());

    return resourceTypes.reduce((acc, resourceType) => {
      const quota = entities[resourceType];

      return {
        ...acc,
        [resourceType]: {
          minimum: quota ? quota.minimum : -1,
          maximum: quota ? quota.maximum : -1,
        },
      };
    }, {});
  },
);
