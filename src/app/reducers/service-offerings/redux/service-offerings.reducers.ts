import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { createFeatureSelector, createSelector } from '@ngrx/store';

import {
  ComputeOfferingClass,
  defaultComputeOfferingClass,
  ServiceOffering,
  serviceOfferingType,
} from '../../../shared/models';
import * as fromVMs from '../../vm/redux/vm.reducers';
import * as serviceOfferingActions from './service-offerings.actions';

export interface State extends EntityState<ServiceOffering> {
  loading: boolean;
  filters: {
    selectedViewMode: string;
    selectedClasses: string[];
    query: string;
  };
}

export interface OfferingsState {
  list: State;
}

export const serviceOfferingReducers = {
  list: reducer,
};

export const adapter: EntityAdapter<ServiceOffering> = createEntityAdapter<ServiceOffering>({
  selectId: (item: ServiceOffering) => item.id,
  sortComparer: false,
});

export const initialFilters = {
  selectedViewMode: serviceOfferingType.fixed,
  selectedClasses: [],
  query: '',
};

export const initialState: State = adapter.getInitialState({
  loading: false,
  filters: initialFilters,
});

export function reducer(state = initialState, action: serviceOfferingActions.Actions): State {
  switch (action.type) {
    case serviceOfferingActions.LOAD_SERVICE_OFFERINGS_REQUEST: {
      return {
        ...state,
        loading: true,
      };
    }
    case serviceOfferingActions.SERVICE_OFFERINGS_FILTER_UPDATE: {
      return {
        ...state,
        filters: {
          ...state.filters,
          ...action.payload,
        },
      };
    }
    case serviceOfferingActions.LOAD_SERVICE_OFFERINGS_RESPONSE: {
      const offerings = action.payload;
      return {
        ...adapter.addAll(offerings, state),
        loading: false,
      };
    }

    default: {
      return state;
    }
  }
}

export const getOfferingsState = createFeatureSelector<OfferingsState>('service-offerings');

export const getOfferingsEntitiesState = createSelector(getOfferingsState, state => state.list);

export const { selectIds, selectEntities, selectAll, selectTotal } = adapter.getSelectors(
  getOfferingsEntitiesState,
);

export const isLoading = createSelector(getOfferingsEntitiesState, state => state.loading);

export const filters = createSelector(getOfferingsEntitiesState, state => state.filters);

export const filterSelectedViewMode = createSelector(filters, state => state.selectedViewMode);

export const filterSelectedClasses = createSelector(filters, state => state.selectedClasses);

export const filterQuery = createSelector(filters, state => state.query);

export const getSelectedOffering = createSelector(
  selectEntities,
  fromVMs.getSelectedVM,
  (entities, vm) => vm && entities[vm.serviceofferingid],
);

export const classesFilter = (
  offering: ServiceOffering,
  soClasses: ComputeOfferingClass[],
  classesMap: any,
) => {
  const classes = soClasses.filter(
    soClass => soClass.computeOfferings && soClass.computeOfferings.indexOf(offering.id) > -1,
  );
  const showGeneral = !!classesMap[defaultComputeOfferingClass.id];
  return (
    (classes.length && classes.find(soClass => classesMap[soClass.id])) ||
    (showGeneral && !classes.length)
  );
};
