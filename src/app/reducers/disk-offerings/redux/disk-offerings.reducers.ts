import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { DiskOffering } from '../../../shared/models/disk-offering.model';
import { isOfferingLocal } from '../../../shared/models/offering.model';
import { Zone } from '../../../shared/models/zone.model';
import { OfferingAvailability } from '../../../shared/services/offering.service';
import * as fromServiceOfferings from '../../service-offerings/redux/service-offerings.reducers';
import * as fromVolumes from '../../volumes/redux/volumes.reducers';
import * as fromZones from '../../zones/redux/zones.reducers';
import * as event from './disk-offerings.actions';

/**
 * @ngrx/entity provides a predefined interface for handling
 * a structured dictionary of records. This interface
 * includes an array of ids, and a dictionary of the provided
 * model type by id. This interface is extended to include
 * any additional interface properties.
 */
export interface State extends EntityState<DiskOffering> {
  loading: boolean;
  tableParams: Array<string>;
}

export interface OfferingsState {
  list: State;
}

export const diskOfferingReducers = {
  list: reducer,
};

/**
 * createEntityAdapter creates many an object of helper
 * functions for single or multiple operations
 * against the dictionary of records. The configuration
 * object takes a record id selector function and
 * a sortComparer option which is set to a compare
 * function if the records are to be sorted.
 */
export const adapter: EntityAdapter<DiskOffering> = createEntityAdapter<DiskOffering>({
  selectId: (item: DiskOffering) => item.id,
  sortComparer: false
});

/** getInitialState returns the default initial state
 * for the generated entity state. Initial state
 * additional properties can also be defined.
 */
export const initialState: State = adapter.getInitialState({
  loading: false,
  tableParams: []
});

export function reducer(
  state = initialState,
  action: event.Actions
): State {
  switch (action.type) {
    case event.LOAD_DISK_OFFERINGS_REQUEST: {
      return {
        ...state,
        loading: true
      };
    }
    case event.LOAD_DISK_OFFERINGS_RESPONSE: {

      const offerings = action.payload;

      return {
        /**
         * The addMany function provided by the created adapter
         * adds many records to the entity dictionary
         * and returns a new state including those records. If
         * the collection is to be sorted, the adapter will
         * sort each record upon entry into the sorted array.
         */
        ...adapter.addAll(offerings, state),
        loading: false
      };
    }

    case event.LOAD_DEFAULT_DISK_PARAMS_RESPONSE: {
      return {
        ...state,
        tableParams: action.payload
      }
    }

    default: {
      return state;
    }
  }
}


export const getOfferingsState = createFeatureSelector<OfferingsState>('disk-offerings');

export const getOfferingsEntitiesState = createSelector(
  getOfferingsState,
  state => state.list
);

export const getParams = createSelector(
  getOfferingsEntitiesState,
  state => state.tableParams
);

export const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
} = adapter.getSelectors(getOfferingsEntitiesState);

export const isLoading = createSelector(
  getOfferingsEntitiesState,
  state => state.loading
);

const isOfferingAvailableInZone = (
  offering: DiskOffering,
  offeringAvailability: OfferingAvailability,
  zone: Zone
) => {
  return offeringAvailability[zone.id] && offeringAvailability[zone.id].diskOfferings.indexOf(offering.id) !== -1;
};

export const getSelectedOffering = createSelector(
  selectEntities,
  fromVolumes.getSelectedVolume,
  (entities, volume) => volume && entities[volume.diskofferingid]
);

const getOfferingsAvailableInZone = (
  offeringList: Array<DiskOffering>,
  offeringAvailability: OfferingAvailability,
  zone: Zone
) => {
  if (!offeringAvailability.filterOfferings) {
    return offeringList;
  }

  return offeringList
    .filter(offering => {
      const offeringAvailableInZone = isOfferingAvailableInZone(
        offering,
        offeringAvailability,
        zone
      );
      const localStorageCompatibility = zone.localstorageenabled || !isOfferingLocal(
        offering);
      return offeringAvailableInZone && localStorageCompatibility;
    });
};

export const getAvailableOfferings = createSelector(
  selectAll,
  fromServiceOfferings.offeringAvailability,
  fromZones.getSelectedZone,
  (
    diskOfferings, availability,
    zone
  ) => {
    if (zone && availability) {
      const availableOfferings = getOfferingsAvailableInZone(
        diskOfferings,
        availability,
        zone
      );
      return availableOfferings;
    } else {
      return [];
    }
  }
);
