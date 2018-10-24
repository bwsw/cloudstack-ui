import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { createFeatureSelector, createSelector } from '@ngrx/store';

import { isOfferingLocal } from '../../../shared/models/offering.model';
import { DiskOffering, ServiceOfferingAvailability, Zone } from '../../../shared/models';
import { configSelectors } from '../../../root-store';
import * as fromVolumes from '../../volumes/redux/volumes.reducers';
import * as fromZones from '../../zones/redux/zones.reducers';
import * as event from './disk-offerings.actions';

export interface State extends EntityState<DiskOffering> {
  loading: boolean;
}

export interface OfferingsState {
  list: State;
}

export const diskOfferingReducers = {
  list: reducer,
};

export const adapter: EntityAdapter<DiskOffering> = createEntityAdapter<DiskOffering>({
  selectId: (item: DiskOffering) => item.id,
  sortComparer: false,
});

export const initialState: State = adapter.getInitialState({
  loading: false,
});

export function reducer(state = initialState, action: event.Actions): State {
  switch (action.type) {
    case event.LOAD_DISK_OFFERINGS_REQUEST: {
      return {
        ...state,
        loading: true,
      };
    }
    case event.LOAD_DISK_OFFERINGS_RESPONSE: {
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

export const getOfferingsState = createFeatureSelector<OfferingsState>('disk-offerings');

export const getOfferingsEntitiesState = createSelector(getOfferingsState, state => state.list);

export const { selectIds, selectEntities, selectAll, selectTotal } = adapter.getSelectors(
  getOfferingsEntitiesState,
);

export const isLoading = createSelector(getOfferingsEntitiesState, state => state.loading);

const isDiskOfferingAvailableInZone = (
  offering: DiskOffering,
  offeringAvailability: ServiceOfferingAvailability,
  zone: Zone,
) => {
  if (offeringAvailability.zones[zone.id]) {
    const isOfferingExist =
      offeringAvailability.zones[zone.id].diskOfferings.indexOf(offering.id) !== -1;
    return isOfferingExist;
  }
  return false;
};

export const getSelectedOffering = createSelector(
  selectEntities,
  fromVolumes.getSelectedVolume,
  (entities, volume) => volume && entities[volume.diskofferingid],
);

const getOfferingsAvailableInZone = (
  offeringList: DiskOffering[],
  offeringAvailability: ServiceOfferingAvailability,
  zone: Zone,
) => {
  if (!offeringAvailability.filterOfferings) {
    return offeringList;
  }

  return offeringList.filter(offering => {
    const offeringAvailableInZone = isDiskOfferingAvailableInZone(
      offering,
      offeringAvailability,
      zone,
    );
    const localStorageCompatibility = zone.localstorageenabled || !isOfferingLocal(offering);
    return offeringAvailableInZone && localStorageCompatibility;
  });
};

export const getAvailableOfferings = createSelector(
  selectAll,
  configSelectors.get('serviceOfferingAvailability'),
  fromZones.getSelectedZone,
  (diskOfferings, availability, zone) => {
    if (zone && availability) {
      const availableOfferings = getOfferingsAvailableInZone(diskOfferings, availability, zone);
      return availableOfferings;
    }
    return [];
  },
);
