import { createSelector } from '@ngrx/store';

import { VmCompatibilityPolicy } from '../shared/vm-compatibility-policy';
import { ResourceStats } from '../../shared/services/resource-usage.service';
import { ComputeOfferingViewModel } from '../view-models';
import { isOfferingLocal } from '../../shared/models/offering.model';
import { ComputeOfferingClass, defaultComputeOfferingClass, OfferingAvailability } from '../../shared/models/config';
import { ServiceOffering, ServiceOfferingType, Zone } from '../../shared/models';
import { getComputeOfferingViewModel } from './view-models';
import { configSelectors } from '../../root-store';
import * as fromZones from '../../reducers/zones/redux/zones.reducers';
import * as fromAuths from '../../reducers/auth/redux/auth.reducers';
import * as fromVMs from '../../reducers/vm/redux/vm.reducers';
import {
  filterQuery,
  filterSelectedClasses,
  filterSelectedViewMode,
  getSelectedOffering,
} from '../../reducers/service-offerings/redux/service-offerings.reducers';

const isComputeOfferingAvailableInZone = (
  offering: ServiceOffering,
  availability: OfferingAvailability,
  zone: Zone
) => {
  if (availability.zones[zone.id]) {
    const isOfferingExist = availability.zones[zone.id].serviceOfferings.indexOf(offering.id) !== -1;
    return isOfferingExist;
  }
  return false;
};

const getOfferingsAvailableInZone = (
  offeringList: ComputeOfferingViewModel[],
  availability: OfferingAvailability,
  zone: Zone
) => {
  if (!availability.filterOfferings) {
    return offeringList;
  }

  return offeringList.filter(offering => {
    const offeringAvailableInZone = isComputeOfferingAvailableInZone(offering, availability, zone);
    const localStorageCompatibility = zone.localstorageenabled || !isOfferingLocal(offering);
    return offeringAvailableInZone && localStorageCompatibility;
  });
};

const getAvailableByResourcesSync = (
  serviceOfferings: ComputeOfferingViewModel[],
  availability: OfferingAvailability,
  resourceUsage: ResourceStats,
  zone: Zone
) => {
  const availableInZone = getOfferingsAvailableInZone(serviceOfferings, availability, zone);

  return availableInZone.filter(offering => {
    let enoughCpus;
    let enoughMemory;

    if (offering.iscustomized) {
      enoughCpus = resourceUsage.available.cpus >= offering.customOfferingRestrictions.cpunumber.min;
      enoughMemory = resourceUsage.available.memory >= offering.customOfferingRestrictions.memory.min;
    } else {
      enoughCpus = resourceUsage.available.cpus >= offering.cpunumber;
      enoughMemory = resourceUsage.available.memory >= offering.memory;
    }

    return enoughCpus && enoughMemory;
  });
};

export const getAvailableOfferingsForVmCreation = createSelector(
  getComputeOfferingViewModel,
  configSelectors.get('offeringAvailability'),
  fromVMs.getVMCreationZone,
  fromAuths.getUserAccount,
  (serviceOfferings, availability, zone, user) => {
    if (!zone || !user) {
      return [];
    }

    const resourceUsage = ResourceStats.fromAccount([user]);
    return getAvailableByResourcesSync(serviceOfferings, availability, resourceUsage, zone);
  }
);

export const getAvailableOfferings = createSelector(
  getComputeOfferingViewModel,
  getSelectedOffering,
  configSelectors.get('offeringAvailability'),
  configSelectors.get('offeringCompatibilityPolicy'),
  fromZones.getSelectedZone,
  fromAuths.getUserAccount,
  (
    serviceOfferings,
    currentOffering,
    availability,
    compatibilityPolicy,
    zone,
    user
  ) => {
    if (!zone || !user) {
      return [];
    }

    const resourceUsage = ResourceStats.fromAccount([user]);
    const availableOfferings = getAvailableByResourcesSync(serviceOfferings, availability, resourceUsage, zone);

    const filterByCompatibilityPolicy = VmCompatibilityPolicy.getFilter(compatibilityPolicy, currentOffering);

    const filterStorageType = (offering: ServiceOffering) => offering.storagetype === currentOffering.storagetype;

    return availableOfferings.filter(item => filterByCompatibilityPolicy(item) && filterStorageType(item));
  }
);

export const classesFilter = (offering: ServiceOffering, soClasses: ComputeOfferingClass[], classesMap: any) => {
  const classes = soClasses.filter(soClass =>
    soClass.computeOfferings && soClass.computeOfferings.indexOf(offering.id) > -1);
  const showGeneral = !!classesMap[defaultComputeOfferingClass.id];
  return classes.length && classes.find(soClass => classesMap[soClass.id])
    || (showGeneral && !classes.length);
};

export const selectFilteredOfferingsForVmCreation = createSelector(
  getAvailableOfferingsForVmCreation,
  filterSelectedViewMode,
  filterSelectedClasses,
  filterQuery,
  configSelectors.get('computeOfferingClasses'),
  (offerings, viewMode, selectedClasses, query, classes) => {
    const classesMap = selectedClasses.reduce((m, i) => ({ ...m, [i]: i }), {});
    const queryLower = query && query.toLowerCase();

    const selectedViewModeFilter = (offering: ComputeOfferingViewModel) => {
      return viewMode === ServiceOfferingType.custom ? offering.iscustomized : !offering.iscustomized;
    };

    const selectedClassesFilter = (offering: ComputeOfferingViewModel) => {
      if (selectedClasses.length) {
        return classesFilter(offering, classes, classesMap);
      }
      return true;
    };

    const queryFilter = (offering: ComputeOfferingViewModel) => !query || offering.name.toLowerCase()
      .includes(queryLower);

    return offerings.filter((offering: ComputeOfferingViewModel) => selectedViewModeFilter(
      offering) && queryFilter(offering) && selectedClassesFilter(offering));
  }
);

export const selectFilteredOfferings = createSelector(
  getAvailableOfferings,
  filterSelectedViewMode,
  filterSelectedClasses,
  filterQuery,
  configSelectors.get('computeOfferingClasses'),
  (offerings, viewMode, selectedClasses, query, classes) => {
    const classesMap = selectedClasses.reduce((m, i) => ({ ...m, [i]: i }), {});
    const queryLower = query && query.toLowerCase();

    const selectedViewModeFilter = (offering: ServiceOffering) => {
      return viewMode === ServiceOfferingType.custom ? offering.iscustomized : !offering.iscustomized;
    };

    const selectedClassesFilter = (offering: ServiceOffering) => {
      if (selectedClasses.length) {
        return classesFilter(offering, classes, classesMap);
      }
      return true;
    };

    const queryFilter = (offering: ServiceOffering) => !query || offering.name.toLowerCase().includes(queryLower);

    return offerings.filter((offering: ServiceOffering) =>
      selectedViewModeFilter(offering) && queryFilter(offering) && selectedClassesFilter(offering))
  }
);
