import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as merge from 'lodash/merge';
import {
  DefaultCustomServiceOfferingRestrictions,
  ICustomOfferingRestrictions,
  ICustomOfferingRestrictionsByZone
} from '../../../service-offering/custom-service-offering/custom-offering-restrictions';
import {
  CustomServiceOffering,
  ICustomServiceOffering
} from '../../../service-offering/custom-service-offering/custom-service-offering';
// tslint:disable-next-line
import { customServiceOfferingFallbackParams } from '../../../service-offering/custom-service-offering/service/custom-service-offering.service';
import { isOfferingLocal } from '../../../shared/models/offering.model';
import { ServiceOffering } from '../../../shared/models/service-offering.model';
import { Zone } from '../../../shared/models/zone.model';
import {
  OfferingAvailability,
  OfferingCompatibilityPolicy,
  OfferingPolicy
} from '../../../shared/services/offering.service';
import { ResourceStats } from '../../../shared/services/resource-usage.service';
import * as fromAuths from '../../auth/redux/auth.reducers';
import * as fromVMs from '../../vm/redux/vm.reducers';
import * as fromZones from '../../zones/redux/zones.reducers';


import * as serviceOfferingActions from './service-offerings.actions';


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
  offeringCompatibilityPolicy: OfferingCompatibilityPolicy
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
  customOfferingRestrictions: {},
  offeringCompatibilityPolicy: {
    offeringChangePolicy: OfferingPolicy.NO_RESTRICTIONS
  }
});

export function reducer(
  state = initialState,
  action: serviceOfferingActions.Actions
): State {
  switch (action.type) {
    case serviceOfferingActions.LOAD_SERVICE_OFFERINGS_REQUEST: {
      return {
        ...state,
        loading: true
      };
    }
    case serviceOfferingActions.LOAD_SERVICE_OFFERINGS_RESPONSE: {

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

    case serviceOfferingActions.LOAD_OFFERING_AVAILABILITY_RESPONSE: {
      return {
        ...state,
        offeringAvailability: action.payload
      };
    }

    case serviceOfferingActions.LOAD_CUSTOM_RESTRICTION_RESPONSE: {
      return {
        ...state,
        customOfferingRestrictions: action.payload
      };
    }

    case serviceOfferingActions.LOAD_DEFAULT_PARAMS_RESPONSE: {
      return {
        ...state,
        defaultParams: action.payload
      };
    }

    case serviceOfferingActions.LOAD_COMPATIBILITY_POLICY_RESPONSE: {
      return {
        ...state,
        offeringCompatibilityPolicy: {
          ...state.offeringCompatibilityPolicy,
          ...action.payload
        }
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

export const offeringCompatibilityPolicy = createSelector(
  getOfferingsEntitiesState,
  state => state.offeringCompatibilityPolicy
);

export const getSelectedOffering = createSelector(
  selectEntities,
  fromVMs.getSelectedVM,
  (entities, vm) => vm && entities[vm.serviceOfferingId]
);

export const getAvailableOfferings = createSelector(
  selectAll,
  getSelectedOffering,
  offeringAvailability,
  defaultParams,
  customOfferingRestrictions,
  offeringCompatibilityPolicy,
  fromZones.getSelectedZone,
  fromAuths.getUserAccount,
  (
    serviceOfferings, currentOffering, availability,
    defaults, customRestrictions, compatibilityPolicy,
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
        if (!a.iscustomized && b.iscustomized) {
          return -1;
        }
        if (a.iscustomized && !b.iscustomized) {
          return 1;
        }
        return 0;
      });

      const filterByCompatibilityPolicy = (offering: ServiceOffering) => {
        if (compatibilityPolicy) {
          const oldTags = currentOffering.hosttags
            ? currentOffering.hosttags.split(',')
            : [];
          const newTags = offering.hosttags ? offering.hosttags.split(',') : [];
          return matchHostTags(oldTags, newTags, compatibilityPolicy);
        } else {
          return true;
        }
      };

      const filterStorageType = (offering: ServiceOffering) => offering.storagetype === currentOffering.storagetype;

      return availableOfferings.map((offering: ServiceOffering) => {
        return !offering.iscustomized
          ? offering
          : getCustomOfferingWithSetParams(
            offering,
            defaults[zone.id] && defaults[zone.id].customOfferingParams,
            customOfferingRestrictions[zone.id],
            ResourceStats.fromAccount([user])
          );
      }).filter(item => filterByCompatibilityPolicy(item) && filterStorageType(item));
    } else {
      return [];
    }
  }
);

export const getAvailableOfferingsForVmCreation = createSelector(selectAll,
  offeringAvailability,
  defaultParams,
  customOfferingRestrictions,
  fromVMs.getVmCreationZoneId,
  fromZones.selectEntities,
  fromAuths.getUserAccount,
  (
    serviceOfferings, availability,
    defaults, customRestrictions,
    zoneId, zones, user
  ) => {
    const zone = zones && zones[zoneId];
    if (zone && user) {
      const availableOfferings = getAvailableByResourcesSync(
        serviceOfferings,
        availability,
        customRestrictions,
        ResourceStats.fromAccount([user]),
        zone
      );

      return availableOfferings.map((offering: ServiceOffering) => {
        return !offering.iscustomized
          ? offering
          : getCustomOfferingWithSetParams(
            offering,
            defaults[zone.id] && defaults[zone.id].customOfferingParams,
            customOfferingRestrictions[zone.id],
            ResourceStats.fromAccount([user])
          );
      }).filter(item => item);
    } else {
      return [];
    }
  });

export const getOfferingsAvailableInZone = (
  offeringList: Array<ServiceOffering>,
  availability: OfferingAvailability,
  zone: Zone
) => {
  if (!availability[zone.id] || !availability[zone.id].filterOfferings) {
    return offeringList;
  }

  return offeringList
    .filter(offering => {
      const offeringAvailableInZone = isOfferingAvailableInZone(
        offering,
        availability,
        zone
      );
      const localStorageCompatibility = zone.localstorageenabled || !isOfferingLocal(
        offering);
      return offeringAvailableInZone && localStorageCompatibility;
    });
};

export const isOfferingAvailableInZone = (
  offering: ServiceOffering,
  availability: OfferingAvailability,
  zone: Zone
) => {
  if (!availability[zone.id] || !availability[zone.id].filterOfferings) {
    return true;
  }
  return availability[zone.id].serviceOfferings.indexOf(offering.id) !== -1;
};

export const getAvailableByResourcesSync = (
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

      if (offering.iscustomized) {
        const restrictions = merge(
          DefaultCustomServiceOfferingRestrictions,
          offeringRestrictions && offeringRestrictions[zone.id]
        );
        enoughCpus = !restrictions.cpunumber || restrictions.cpunumber.min < resourceUsage.available.cpus;
        enoughMemory = !restrictions.memory || restrictions.memory.min < resourceUsage.available.memory;
      } else {
        enoughCpus = resourceUsage.available.cpus >= offering.cpunumber;
        enoughMemory = resourceUsage.available.memory >= offering.memory;
      }

      return enoughCpus && enoughMemory;
    })
    .sort((a: ServiceOffering, b: ServiceOffering) => {
      if (!a.iscustomized && b.iscustomized) {
        return -1;
      }
      if (a.iscustomized && !b.iscustomized) {
        return 1;
      }
      return 0;
    });
};

export const getCustomOfferingWithSetParams = (
  serviceOffering: CustomServiceOffering,
  defaults: ICustomServiceOffering,
  customRestrictions: ICustomOfferingRestrictions,
  resourceStats: ResourceStats
): CustomServiceOffering => {

  const getServiceOfferingRestriction = (param) => {
    return serviceOffering[param]
      || defaults && defaults[param]
      || customRestrictions && customRestrictions[param] && customRestrictions[param].min
      || customServiceOfferingFallbackParams[param];
  };

  const cpunumber = getServiceOfferingRestriction('cpunumber');
  const cpuspeed = getServiceOfferingRestriction('cpuspeed');
  const memory = getServiceOfferingRestriction('memory');

  const restrictions = getRestrictionIntersection(
    customRestrictions,
    resourceStats
  );

  if (!restrictionsAreCompatible(restrictions)) {
    return undefined;
  }

  const normalizedParams = clipOfferingParamsToRestrictions(
    { cpunumber, cpuspeed, memory },
    restrictions
  );

  return { ...serviceOffering, ...normalizedParams };
};

export const getCustomRestrictionsForVmCreation = createSelector(customOfferingRestrictions,
  fromVMs.getVmCreationZoneId, (restrictions, zoneId) => {
    return restrictions && restrictions[zoneId] || DefaultCustomServiceOfferingRestrictions;
  });

export const restrictionsAreCompatible = (restrictions: ICustomOfferingRestrictions) => {
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

export const clipOfferingParamsToRestrictions = (
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


export const getRestrictionIntersection = (
  customRestrictions: ICustomOfferingRestrictions,
  resourceStats: ResourceStats
) => {
  const result = {
    cpunumber: {
      max: resourceStats.available.cpus
    },
    memory: {
      max: resourceStats.available.memory
    }
  };

  if (customRestrictions == null) {
    return result;
  }

  if (customRestrictions.cpunumber != null) {
    if (customRestrictions.cpunumber.min != null) {
      result.cpunumber['min'] = customRestrictions.cpunumber.min;
    }

    if (customRestrictions.cpunumber.max != null) {
      result.cpunumber['max'] = Math.min(
        customRestrictions.cpunumber.max,
        result.cpunumber.max
      );
    }
  }

  if (customRestrictions.cpuspeed != null) {
    if (customRestrictions.cpuspeed.min != null) {
      if (!result['cpuspeed']) {
        result['cpuspeed'] = {};
      }

      result['cpuspeed']['min'] = customRestrictions.cpuspeed.min;
    }

    if (customRestrictions.cpuspeed.max != null) {
      if (!result['cpuspeed']) {
        result['cpuspeed'] = {};
      }

      result['cpuspeed']['max'] = customRestrictions.cpuspeed.max;
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


export const matchHostTags = (
  oldTags: Array<string>,
  newTags: Array<string>,
  compatibilityPolicy: OfferingCompatibilityPolicy
) => {
  const ignoreTags = compatibilityPolicy.offeringChangePolicyIgnoreTags;
  if (ignoreTags) {
    oldTags = filterTags(oldTags, ignoreTags);
    newTags = filterTags(newTags, ignoreTags);
  }
  switch (compatibilityPolicy.offeringChangePolicy) {
    case OfferingPolicy.CONTAINS_ALL: {
      return includeTags(oldTags, newTags);
    }
    case OfferingPolicy.EXACTLY_MATCH: {
      return oldTags.length === newTags.length ? includeTags(oldTags, newTags) : false;
    }
    case OfferingPolicy.NO_RESTRICTIONS:
    default: {
      return true;
    }
  }
};

const filterTags = (
  tags, ignoreTags
) => {
  return tags.filter(t => ignoreTags.indexOf(t) === -1);
};

export const includeTags = (
  oldTags: Array<string>,
  newTags: Array<string>
) => {
  return !oldTags.find(tag => newTags.indexOf(tag) === -1);
};
