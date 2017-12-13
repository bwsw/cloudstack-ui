import { createFeatureSelector, createSelector } from '@ngrx/store';
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { ServiceOffering } from '../../../shared/models/service-offering.model';
import { OfferingAvailability } from '../../../shared/services/offering.service';
import { ResourceStats } from '../../../shared/services/resource-usage.service';
import { Zone } from '../../../shared/models/zone.model';
import {
  CustomServiceOffering,
  ICustomServiceOffering
} from '../../../service-offering/custom-service-offering/custom-service-offering';
import {
  ICustomOfferingRestrictions,
  ICustomOfferingRestrictionsByZone
} from '../../../service-offering/custom-service-offering/custom-offering-restrictions';
import {
  DefaultCustomServiceOfferingRestrictions
} from '../../../service-offering/custom-service-offering/custom-service-offering.component';
import {
  customServiceOfferingFallbackParams
} from '../../../service-offering/custom-service-offering/service/custom-service-offering.service';

import * as event from './service-offerings.actions';
import * as fromVMs from '../../vm/redux/vm.reducers';
import * as fromAuths from '../../auth/redux/auth.reducers';
import * as fromZones from '../../zones/redux/zones.reducers';
import * as merge from 'lodash/merge';

/**
 * @ngrx/entity provides a predefined interface for handling
 * a structured dictionary of records. This interface
 * includes an array of ids, and a dictionary of the provided
 * model type by id. This interface is extended to include
 * any additional interface properties.
 */
export interface State extends EntityState<ServiceOffering> {
  loading: boolean;
  offeringAvailability: OfferingAvailability;
  defaultParams: ICustomServiceOffering;
  customOfferingRestrictions: ICustomOfferingRestrictionsByZone;
}

export interface OfferingsState {
  list: State;
}

export const serviceOfferingReducers = {
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
export const adapter: EntityAdapter<ServiceOffering> = createEntityAdapter<ServiceOffering>(
  {
    selectId: (item: ServiceOffering) => item.id,
    sortComparer: false
  });

/** getInitialState returns the default initial state
 * for the generated entity state. Initial state
 * additional properties can also be defined.
 */
export const initialState: State = adapter.getInitialState({
  loading: false,
  offeringAvailability: {},
  defaultParams: {},
  customOfferingRestrictions: {}
});

export function reducer(
  state = initialState,
  action: event.Actions
): State {
  switch (action.type) {
    case event.LOAD_SERVICE_OFFERINGS_REQUEST: {
      return {
        ...state,
        loading: true
      };
    }
    case event.LOAD_SERVICE_OFFERINGS_RESPONSE: {

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

    case event.LOAD_OFFERING_AVAILABILITY_RESPONSE: {
      return {
        ...state,
        offeringAvailability: action.payload
      };
    }

    case event.LOAD_CUSTOM_RESTRICTION_RESPONSE: {
      return {
        ...state,
        customOfferingRestrictions: action.payload
      };
    }

    case event.LOAD_DEFAULT_PARAMS_RESPONSE: {
      return {
        ...state,
        defaultParams: action.payload
      };
    }

    default: {
      return state;
    }
  }
}


export const getOfferingsState = createFeatureSelector<OfferingsState>('service-offerings');

export const getOfferingsEntitiesState = createSelector(
  getOfferingsState,
  state => state.list
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

export const offeringAvailability = createSelector(
  getOfferingsEntitiesState,
  state => state.offeringAvailability
);

export const defaultParams = createSelector(
  getOfferingsEntitiesState,
  state => state.defaultParams
);

export const customOfferingRestrictions = createSelector(
  getOfferingsEntitiesState,
  state => state.customOfferingRestrictions
);

export const getSelectedOffering = createSelector(
  selectEntities,
  fromVMs.getSelectedVM,
  (entities, vm) => vm && entities[vm.serviceOfferingId]
);

export const getAvailableOfferings = createSelector(
  selectAll,
  offeringAvailability,
  defaultParams,
  customOfferingRestrictions,
  fromZones.getSelectedZone,
  fromAuths.getUserAccount,
  (
    serviceOfferings, availability,
    defaults, customRestrictions,
    zone, user
  ) => {
    if (zone && user) {
      const availableOfferings = getAvailableByResourcesSync(
        serviceOfferings,
        availability,
        customRestrictions,
        ResourceStats.fromAccount([user]),
        zone
      ).sort((a: ServiceOffering, b: ServiceOffering) => {
        if (!a.isCustomized && b.isCustomized) {
          return -1;
        }
        if (a.isCustomized && !b.isCustomized) {
          return 1;
        }
        return 0;
      });
      return availableOfferings.map((offering) => {
        return !offering.isCustomized
          ? offering
          : getCustomOfferingWithSetParams(
            offering,
            defaultParams[zone.id] && defaultParams[zone.id].customOfferingParams,
            customOfferingRestrictions[zone.id],
            ResourceStats.fromAccount([user])
          );
      }).filter(item => item);
    }
  }
);

const getOfferingsAvailableInZone = (
  offeringList: Array<ServiceOffering>,
  availability: OfferingAvailability,
  zone: Zone
) => {
  if (!availability.filterOfferings) {
    return offeringList;
  }

  return offeringList
    .filter(offering => {
      const offeringAvailableInZone = this.isOfferingAvailableInZone(
        offering,
        availability,
        zone
      );
      const localStorageCompatibility = zone.localstorageenabled || !offering.isLocal;
      return offeringAvailableInZone && localStorageCompatibility;
    });
};

const getAvailableByResourcesSync = (
  serviceOfferings: Array<ServiceOffering>,
  availability: OfferingAvailability,
  offeringRestrictions: ICustomOfferingRestrictionsByZone,
  resourceUsage: ResourceStats,
  zone: Zone
) => {
  const availableInZone = getOfferingsAvailableInZone(
    serviceOfferings,
    availability,
    zone
  );

  return availableInZone
    .filter(offering => {
      let enoughCpus;
      let enoughMemory;

      if (offering.isCustomized) {
        const restrictions = merge(
          DefaultCustomServiceOfferingRestrictions,
          offeringRestrictions && offeringRestrictions[zone.id]
        );
        enoughCpus = !restrictions.cpuNumber || restrictions.cpuNumber.min < resourceUsage.available.cpus;
        enoughMemory = !restrictions.memory || restrictions.memory.min < resourceUsage.available.memory;
      } else {
        enoughCpus = resourceUsage.available.cpus >= offering.cpuNumber;
        enoughMemory = resourceUsage.available.memory >= offering.memory;
      }

      return enoughCpus && enoughMemory;
    });
};

const getCustomOfferingWithSetParams = (
  serviceOffering: CustomServiceOffering,
  defaults: ICustomServiceOffering,
  customRestrictions: ICustomOfferingRestrictions,
  resourceStats: ResourceStats
) => {

  const getServiceOfferingRestriction = (param) => {
    return serviceOffering[param]
      || defaults && defaults[param]
      || customRestrictions && customRestrictions[param] && customRestrictions[param].min
      || customServiceOfferingFallbackParams[param];
  };

  const cpuNumber = getServiceOfferingRestriction('cpuNumber');
  const cpuSpeed = getServiceOfferingRestriction('cpuSpeed');
  const memory = getServiceOfferingRestriction('memory');

  const restrictions = getRestrictionIntersection(
    customRestrictions,
    resourceStats
  );

  if (!restrictionsAreCompatible(restrictions)) {
    return undefined;
  }

  const normalizedParams = clipOfferingParamsToRestrictions(
    { cpuNumber, cpuSpeed, memory },
    restrictions
  );

  return new CustomServiceOffering({ ...normalizedParams, serviceOffering });
};

const restrictionsAreCompatible = (restrictions: ICustomOfferingRestrictions) => {
  return Object.keys(restrictions).reduce((acc, key) => {
    return (
      acc &&
      (restrictions[key] == null ||
        restrictions[key].min == null ||
        restrictions[key].max == null ||
        restrictions[key].min < restrictions[key].max)
    );
  }, true);
};

const clipOfferingParamsToRestrictions = (
  offeringParams: ICustomServiceOffering,
  restrictions: ICustomOfferingRestrictions
) => {
  return Object.keys(offeringParams).reduce((acc, key) => {
    if (!restrictions[key]) {
      return Object.assign(acc, { [key]: offeringParams[key] });
    }

    if (offeringParams[key] > restrictions[key].max) {
      return Object.assign(acc, { [key]: restrictions[key].max });
    }

    if (offeringParams[key] < restrictions[key].min) {
      return Object.assign(acc, { [key]: restrictions[key].min });
    }

    return Object.assign(acc, { [key]: offeringParams[key] });
  }, {});
};


const getRestrictionIntersection = (
  customRestrictions: ICustomOfferingRestrictions,
  resourceStats: ResourceStats
) => {
  const result = {
    cpuNumber: {
      max: resourceStats.available.cpus
    },
    memory: {
      max: resourceStats.available.memory
    }
  };

  if (customRestrictions == null) {
    return result;
  }

  if (customRestrictions.cpuNumber != null) {
    if (customRestrictions.cpuNumber.min != null) {
      result.cpuNumber['min'] = customRestrictions.cpuNumber.min;
    }

    if (customRestrictions.cpuNumber.max != null) {
      result.cpuNumber['max'] = Math.min(
        customRestrictions.cpuNumber.max,
        result.cpuNumber.max
      );
    }
  }

  if (customRestrictions.cpuSpeed != null) {
    if (customRestrictions.cpuSpeed.min != null) {
      if (!result['cpuSpeed']) {
        result['cpuSpeed'] = {};
      }

      result['cpuSpeed']['min'] = customRestrictions.cpuSpeed.min;
    }

    if (customRestrictions.cpuSpeed.max != null) {
      if (!result['cpuSpeed']) {
        result['cpuSpeed'] = {};
      }

      result['cpuSpeed']['max'] = customRestrictions.cpuSpeed.max;
    }
  }

  if (customRestrictions.memory != null) {
    if (customRestrictions.memory.min != null) {
      result.memory['min'] = customRestrictions.memory.min;
    }

    if (customRestrictions.memory.max != null) {
      result.memory['max'] = Math.min(
        customRestrictions.memory.max,
        result.memory.max
      );
    }
  }

  return result;
};
