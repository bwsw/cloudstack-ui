import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import {
  DefaultCustomServiceOfferingRestrictions,
  ICustomOfferingRestrictions,
  ICustomOfferingRestrictionsByZone
} from '../../../service-offering/custom-service-offering/custom-offering-restrictions';
import {
  CustomServiceOffering,
  customServiceOfferingFallbackParams,
  ICustomServiceOffering
} from '../../../service-offering/custom-service-offering/custom-service-offering';
import { isOfferingLocal } from '../../../shared/models/offering.model';
import {
  DefaultServiceOfferingClassId,
  ServiceOffering,
  ServiceOfferingClassKey,
  ServiceOfferingParamKey,
  ServiceOfferingType
} from '../../../shared/models/service-offering.model';
import { Tag } from '../../../shared/models/tag.model';
import { Zone } from '../../../shared/models/zone.model';
import {
  OfferingAvailability,
  OfferingCompatibilityPolicy,
  OfferingPolicy
} from '../../../shared/services/offering.service';
import { ResourceStats } from '../../../shared/services/resource-usage.service';

import * as fromAccountTags from '../../account-tags/redux/account-tags.reducers';
import * as fromAuths from '../../auth/redux/auth.reducers';
import * as fromVMs from '../../vm/redux/vm.reducers';
import * as fromZones from '../../zones/redux/zones.reducers';
import * as fromSOClass from './service-offering-class.reducers';
import * as merge from 'lodash/merge';
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
  offeringCompatibilityPolicy: OfferingCompatibilityPolicy,
  filters: {
    selectedViewMode: string,
    selectedClasses: string[],
    query: string
  }
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

export const initialFilters = {
  selectedViewMode: ServiceOfferingType.fixed,
  selectedClasses: [],
  query: ''
};

export const initialState: State = adapter.getInitialState({
  loading: false,
  offeringAvailability: {},
  defaultParams: {},
  customOfferingRestrictions: {},
  offeringCompatibilityPolicy: {
    offeringChangePolicy: OfferingPolicy.NO_RESTRICTIONS
  },
  filters: initialFilters
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
    case serviceOfferingActions.SERVICE_OFFERINGS_FILTER_UPDATE: {
      return {
        ...state,
        filters: {
          ...state.filters,
          ...action.payload
        }
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

    case serviceOfferingActions.UPDATE_CUSTOM_SERVICE_OFFERING: {
      return {
        ...adapter.updateOne({ id: action.payload.id, changes: action.payload }, state)
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

export const filters = createSelector(
  getOfferingsEntitiesState,
  state => state.filters
);

export const filterSelectedViewMode = createSelector(
  filters,
  state => state.selectedViewMode
);

export const filterSelectedClasses = createSelector(
  filters,
  state => state.selectedClasses
);

export const filterQuery = createSelector(
  filters,
  state => state.query
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
  customOfferingRestrictions,
  offeringCompatibilityPolicy,
  fromZones.getSelectedZone,
  fromAuths.getUserAccount,
  fromAccountTags.selectServiceOfferingParamTags,
  (
    serviceOfferings, currentOffering, availability,
    customRestrictions, compatibilityPolicy,
    zone, user, paramTags
  ) => {
    if (zone && user) {
      const availableOfferings = getAvailableByResourcesSync(
        serviceOfferings,
        availability,
        zone
      );

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
          : getCustomOfferingWithParams(offering, paramTags);
      })
        .filter(item => filterByCompatibilityPolicy(item) && filterStorageType(item));
    } else {
      return [];
    }
  }
);

export const classesFilter = (offering: ServiceOffering, tags: Tag[], classesMap) => {
  const tag = offering && tags.find(
    t => t.key === ServiceOfferingClassKey + '.' + offering.id);
  const classes = tag && tag.value.split(',');
  const showGeneral = !!classesMap[DefaultServiceOfferingClassId];
  return classes && classes.find(soClass => classesMap[soClass])
    || (showGeneral && !classes);
};

export const selectFilteredOfferings = createSelector(
  getAvailableOfferings,
  filterSelectedViewMode,
  filterSelectedClasses,
  filterQuery,
  fromSOClass.selectEntities,
  fromAccountTags.selectAll,
  (offerings, viewMode, selectedClasses, query, classes, tags) => {
    const classesMap = selectedClasses.reduce((m, i) => ({ ...m, [i]: i }), {});
    const queryLower = query && query.toLowerCase();

    const selectedViewModeFilter = (offering: ServiceOffering) => {
      return viewMode === ServiceOfferingType.custom
        ? offering.iscustomized
        : !offering.iscustomized;
    };

    const selectedClassesFilter = (offering: ServiceOffering) => {
      if (selectedClasses.length) {
        return classesFilter(offering, tags, classesMap);
      }
      return true;
    };

    const queryFilter = (offering: ServiceOffering) => !query || offering.name.toLowerCase()
      .includes(queryLower);

    return offerings.filter((offering: ServiceOffering) => selectedViewModeFilter(
      offering) && queryFilter(offering) && selectedClassesFilter(offering));
  }
);

export const getAvailableOfferingsForVmCreation = createSelector(
  selectAll,
  offeringAvailability,
  fromVMs.getVmCreationZoneId,
  fromZones.selectEntities,
  fromAccountTags.selectServiceOfferingParamTags,
  (
    serviceOfferings, availability,
    zoneId, zones, paramTags
  ) => {
    const zone = zones && zones[zoneId];
    if (zone) {
      const availableOfferings = getAvailableByResourcesSync(
        serviceOfferings,
        availability,
        zone
      );

      return availableOfferings.map((offering: ServiceOffering) => {
        return !offering.iscustomized
          ? offering
          : getCustomOfferingWithParams(offering, paramTags);
      }).filter(item => item);
    } else {
      return [];
    }
  }
);

export const selectFilteredOfferingsForVmCreation = createSelector(
  getAvailableOfferingsForVmCreation,
  filterSelectedViewMode,
  filterSelectedClasses,
  filterQuery,
  fromSOClass.selectEntities,
  fromAccountTags.selectServiceOfferingClassTags,
  (offerings, viewMode, selectedClasses, query, classes, tags) => {
    const classesMap = selectedClasses.reduce((m, i) => ({ ...m, [i]: i }), {});
    const queryLower = query && query.toLowerCase();

    const selectedViewModeFilter = (offering: ServiceOffering) => {
      return viewMode === ServiceOfferingType.custom
        ? offering.iscustomized
        : !offering.iscustomized;
    };

    const selectedClassesFilter = (offering: ServiceOffering) => {
      if (selectedClasses.length) {
        return classesFilter(offering, tags, classesMap);
      }
      return true;
    };

    const queryFilter = (offering: ServiceOffering) => !query || offering.name.toLowerCase()
      .includes(queryLower);

    return offerings.filter((offering: ServiceOffering) => selectedViewModeFilter(
      offering) && queryFilter(offering) && selectedClassesFilter(offering));
  }
);


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
  zone: Zone
) => {
  const availableInZone = getOfferingsAvailableInZone(
    serviceOfferings,
    availability,
    zone
  );

  return availableInZone
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

export const getCustomOfferingWithParams = (
  serviceOffering: CustomServiceOffering,
  tags: Array<Tag>
): CustomServiceOffering => {

  const getValue = (param) => {
    const key = `${ServiceOfferingParamKey}.${serviceOffering.id}.${param}`;
    const tag = tags.find(t => t.key === key);
    return tag && tag.value;
  };
  // tslint:disable-next-line
  const cpunumber = parseInt(getValue('cpuNumber'));
  // tslint:disable-next-line
  const cpuspeed = parseInt(getValue('cpuSpeed'));
  // tslint:disable-next-line
  const memory = parseInt(getValue('memory'));

  if (cpunumber && cpuspeed && memory) {
    const params = { cpunumber, cpuspeed, memory };
    return { ...serviceOffering, ...params };
  } else {
    return serviceOffering;
  }
};

export const getCustomRestrictions = createSelector(
  customOfferingRestrictions,
  fromVMs.getSelectedVM,
  fromAuths.getUserAvailableResources,
  (restrictions, vm, resources) => {
    let resourceLimit: ICustomOfferingRestrictions;
    if (!restrictions || vm && !restrictions[vm.zoneId]) {
      resourceLimit = {
        ...DefaultCustomServiceOfferingRestrictions,
        memory: {
          ...DefaultCustomServiceOfferingRestrictions.memory,
          max: resources && resources.available.memory - (vm ? vm.memory : 0)
        },
        cpunumber: {
          ...DefaultCustomServiceOfferingRestrictions.cpunumber,
          max: resources && resources.available.cpus - (vm ? vm.cpuNumber : 0)
        }
      };
    }

    return restrictions && vm && restrictions[vm.zoneId] || resourceLimit;
  }
);

export const getCustomRestrictionsForVmCreation = createSelector(
  customOfferingRestrictions,
  fromVMs.getVmCreationZoneId,
  fromAuths.getUserAvailableResources,
  (restrictions, zoneId, resources) => {
    let resourceLimit: ICustomOfferingRestrictions;
    if (!restrictions || !restrictions[zoneId]) {
      resourceLimit = {
        ...DefaultCustomServiceOfferingRestrictions,
        memory: {
          ...DefaultCustomServiceOfferingRestrictions.memory,
          max: resources && resources.available.memory
        },
        cpunumber: {
          ...DefaultCustomServiceOfferingRestrictions.cpunumber,
          max: resources && resources.available.cpus
        }
      };
    }

    return restrictions && restrictions[zoneId] || resourceLimit;
  }
);

export const getDefaultParams = createSelector(
  defaultParams,
  getCustomRestrictions,
  getCustomRestrictionsForVmCreation,
  fromAuths.getUserAccount,
  (defaults, customRestrictions, customRestrictionsForVmCreation, user) => {
    const resourceStats = ResourceStats.fromAccount([user]);
    const getServiceOfferingRestriction = (param) => {
      return defaults && defaults[param]
        || customRestrictions && customRestrictions[param] && customRestrictions[param].min
        || customRestrictionsForVmCreation
        && customRestrictionsForVmCreation[param]
        && customRestrictionsForVmCreation[param].min
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

    return { ...normalizedParams };
  }
);

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
