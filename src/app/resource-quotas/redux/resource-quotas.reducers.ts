import { createFeatureSelector, createSelector } from '@ngrx/store';
import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { ResourceQuota } from '../models/resource-quota.model';
import * as resourceQuotasActions from './resource-quotas.actions';

export interface State extends EntityState<ResourceQuota> {
  loading: boolean;
}

export interface ResourceQuotasState {
  list: State;
}

export const resourceQuotasReducers = {
  list: reducer,
};

export const adapter = createEntityAdapter<ResourceQuota>({
  selectId: resourceQuota => resourceQuota.id,
  sortComparer: false,
});

export const initialState: State = adapter.getInitialState({
  loading: false,
});

export function reducer(state = initialState, action: resourceQuotasActions.Actions): State {
  switch (action.type) {
    case resourceQuotasActions.ResourceQuotasActionTypes.LOAD_RESOURCE_QUOTAS_REQUEST: {
      return {
        ...adapter.removeAll(state),
        loading: true,
      };
    }

    case resourceQuotasActions.ResourceQuotasActionTypes.LOAD_RESOURCE_QUOTAS_RESPONSE: {
      return {
        ...adapter.addAll([...action.payload], state),
        loading: false,
      };
    }

    default:
      return state;
  }
}

export const getResourceQuotasState = createFeatureSelector<ResourceQuotasState>('resourceQuotas');

export const getResourceQuotasEntitiesState = createSelector(
  getResourceQuotasState,
  state => state.list,
);

export const { selectIds, selectEntities, selectAll, selectTotal } = adapter.getSelectors(
  getResourceQuotasEntitiesState,
);

export const isLoading = createSelector(
  getResourceQuotasEntitiesState,
  state => state.loading,
);
