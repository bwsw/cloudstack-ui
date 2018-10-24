import { createSelector } from '@ngrx/store';

import { ServiceOffering, serviceOfferingParamKey, Tag } from '../../../shared/models';
import {
  CustomComputeOfferingHardwareRestrictions,
  CustomComputeOfferingHardwareValues,
  CustomComputeOfferingParameters,
  HardwareLimits,
} from '../../../shared/models/config';
import { ComputeOfferingViewModel } from '../../view-models';
import { configSelectors, UserTagsSelectors } from '../../../root-store';
import * as computeOffering from '../../../reducers/service-offerings/redux/service-offerings.reducers';
import * as fromAuth from '../../../reducers/auth/redux/auth.reducers';
import * as fromVms from '../../../reducers/vm/redux/vm.reducers';

interface Resources {
  cpuNumber: number | string;
  memory: number | string;
}

const getFixedAndCustomOfferingsArrays = (offerings: ServiceOffering[]) => {
  const offeringsArrays = {
    customOfferings: [],
    fixedOfferings: [],
  };
  return offerings.reduce((result, offering) => {
    if (offering.iscustomized) {
      result.customOfferings.push(offering);
    } else {
      result.fixedOfferings.push(offering);
    }
    return result;
  }, offeringsArrays);
};

const getCustomOfferingHardwareParameters = (
  offering: ServiceOffering,
  offeringsParameters: CustomComputeOfferingParameters[],
): CustomComputeOfferingParameters | undefined => {
  return (
    offeringsParameters &&
    offeringsParameters.find(parameters => parameters.offeringId === offering.id)
  );
};

const getCustomHardwareValues = (
  params: CustomComputeOfferingParameters | undefined,
): CustomComputeOfferingHardwareValues | null => {
  if (!params) {
    return null;
  }

  return {
    cpunumber: params.cpunumber.value,
    cpuspeed: params.cpuspeed.value,
    memory: params.memory.value,
  };
};

const getCustomHardwareRestrictions = (
  params: CustomComputeOfferingParameters | undefined,
): CustomComputeOfferingHardwareRestrictions | null => {
  if (!params) {
    return null;
  }

  return {
    cpunumber: {
      min: params.cpunumber.min,
      max: params.cpunumber.max,
    },
    cpuspeed: {
      min: params.cpuspeed.min,
      max: params.cpuspeed.max,
    },
    memory: {
      min: params.memory.min,
      max: params.memory.max,
    },
  };
};

const getHardwareValuesFromTags = (
  serviceOffering: ServiceOffering,
  tags: Tag[],
): CustomComputeOfferingHardwareValues | null => {
  const getValue = param => {
    const key = `${serviceOfferingParamKey}.${serviceOffering.id}.${param}`;
    const tag = tags.find(t => t.key === key);
    return tag && tag.value;
  };

  const cpunumber = parseInt(getValue('cpunumber'), 10);
  const cpuspeed = parseInt(getValue('cpuspeed'), 10);
  const memory = parseInt(getValue('memory'), 10);

  if (cpunumber && cpuspeed && memory) {
    return { cpunumber, cpuspeed, memory };
  }
  return null;
};

const checkAvailabilityForFixedByResources = (
  cpuNumber: number,
  memory: number,
  availableResources: Resources,
): boolean => {
  const isEnoughCpuNumber =
    availableResources.cpuNumber === 'Unlimited' || cpuNumber <= availableResources.cpuNumber;
  const isEnoughMemory =
    availableResources.memory === 'Unlimited' || memory <= availableResources.memory;
  return isEnoughCpuNumber && isEnoughMemory;
};

const checkAvailabilityForCustomByResources = (
  cpuNumberRestrictions: HardwareLimits,
  memoryRestrictions: HardwareLimits,
  availableResources: Resources,
): boolean => {
  const isEnoughCpuNumber =
    availableResources.cpuNumber === 'Unlimited' ||
    cpuNumberRestrictions.min <= availableResources.cpuNumber;
  const isEnoughMemory =
    availableResources.memory === 'Unlimited' ||
    memoryRestrictions.min <= availableResources.memory;
  return isEnoughCpuNumber && isEnoughMemory;
};

const getValueThatSatisfiesRestrictions = (defaultValue: number, restrictions: HardwareLimits) => {
  if (restrictions.min > defaultValue) {
    return restrictions.min;
  }
  if (defaultValue > restrictions.max) {
    return restrictions.max;
  }

  return defaultValue;
};

const getValueThatSatisfiesResources = (
  defaultValue: number,
  resourceLimit: string | number,
): number => {
  const limit = Number(resourceLimit);
  if (!isNaN(limit) && limit < defaultValue) {
    return limit;
  }

  return defaultValue;
};

const getRestrictionsThatSatisfiesResources = (
  restrictions: CustomComputeOfferingHardwareRestrictions,
  resources: Resources,
): CustomComputeOfferingHardwareRestrictions => {
  const cpuResource = Number(resources.cpuNumber);
  const memoryResource = Number(resources.memory);
  let maxCpuNumber = restrictions.cpunumber.max;
  if (!isNaN(cpuResource)) {
    maxCpuNumber =
      restrictions.cpunumber.max > cpuResource ? cpuResource : restrictions.cpunumber.max;
  }
  let maxMemory = restrictions.memory.max;
  if (!isNaN(memoryResource)) {
    maxMemory = restrictions.memory.max > memoryResource ? memoryResource : restrictions.memory.max;
  }
  return {
    ...restrictions,
    cpunumber: {
      min: restrictions.cpunumber.min,
      max: maxCpuNumber,
    },
    memory: {
      min: restrictions.memory.min,
      max: maxMemory,
    },
  };
};

const getComputeOfferingViewModel = (
  offerings,
  customComputeOfferingParameters,
  defaultRestrictions,
  defaultHardwareValues,
  tags,
  availableResources,
): ComputeOfferingViewModel[] => {
  const { customOfferings, fixedOfferings } = getFixedAndCustomOfferingsArrays(offerings);

  const customOfferingsWithMetadata: ComputeOfferingViewModel[] = customOfferings.map(
    (offering: ServiceOffering) => {
      const customParameters = getCustomOfferingHardwareParameters(
        offering,
        customComputeOfferingParameters,
      );
      const customHardwareValues = getCustomHardwareValues(customParameters);
      const customHardwareRestrictions = getCustomHardwareRestrictions(customParameters);
      const hardwareValuesFromTags = getHardwareValuesFromTags(offering, tags);

      const prioritizedHardwareValues =
        hardwareValuesFromTags || customHardwareValues || defaultHardwareValues;
      const prioritizedRestrictions = customHardwareRestrictions || defaultRestrictions;

      const isAvailableByResources = checkAvailabilityForCustomByResources(
        prioritizedRestrictions.cpunumber,
        prioritizedRestrictions.memory,
        availableResources,
      );

      let cpunumber = getValueThatSatisfiesRestrictions(
        prioritizedHardwareValues.cpunumber,
        prioritizedRestrictions.cpunumber,
      );
      const cpuspeed = getValueThatSatisfiesRestrictions(
        prioritizedHardwareValues.cpuspeed,
        prioritizedRestrictions.cpuspeed,
      );
      let memory = getValueThatSatisfiesRestrictions(
        prioritizedHardwareValues.memory,
        prioritizedRestrictions.memory,
      );

      if (isAvailableByResources) {
        cpunumber = getValueThatSatisfiesResources(cpunumber, availableResources.cpuNumber);
        memory = getValueThatSatisfiesResources(memory, availableResources.memory);
      }

      const customOfferingRestrictions = getRestrictionsThatSatisfiesResources(
        prioritizedRestrictions,
        availableResources,
      );

      const offeringViewModel: ComputeOfferingViewModel = {
        ...offering,
        cpunumber,
        cpuspeed,
        memory,
        customOfferingRestrictions,
        isAvailableByResources,
      };
      return offeringViewModel;
    },
  );

  const fixedOfferingWithMeta = fixedOfferings.map(offering => {
    const offeringViewModel: ComputeOfferingViewModel = {
      ...offering,
      isAvailableByResources: checkAvailabilityForFixedByResources(
        offering.cpunumber,
        offering.memory,
        availableResources,
      ),
    };
    return offeringViewModel;
  });

  return [...fixedOfferingWithMeta, ...customOfferingsWithMetadata];
};

export const getComputeOfferingForVmEditing = createSelector(
  fromAuth.getUserAccount,
  computeOffering.selectAll,
  configSelectors.get('customComputeOfferingParameters'),
  configSelectors.get('defaultCustomComputeOfferingRestrictions'),
  configSelectors.get('customComputeOfferingHardwareValues'),
  UserTagsSelectors.getServiceOfferingParamTags,
  fromVms.getSelectedVM,
  (
    account,
    offerings,
    customComputeOfferingParameters,
    defaultRestrictions,
    defaultHardwareValues,
    tags,
    vm,
  ): ComputeOfferingViewModel[] => {
    const memoryUsed = vm.memory;
    const cpuNumberUsed = vm.cpunumber;

    const cpuNumber =
      account && account.cpuavailable === 'Unlimited'
        ? account.cpuavailable
        : Number(account.cpuavailable) + cpuNumberUsed;
    const memory =
      account && account.memoryavailable === 'Unlimited'
        ? account.memoryavailable
        : Number(account.memoryavailable) + memoryUsed;

    const availableResources: Resources = { cpuNumber, memory };

    return getComputeOfferingViewModel(
      offerings,
      customComputeOfferingParameters,
      defaultRestrictions,
      defaultHardwareValues,
      tags,
      availableResources,
    );
  },
);

export const getComputeOfferingForVmCreation = createSelector(
  fromAuth.getUserAccount,
  computeOffering.selectAll,
  configSelectors.get('customComputeOfferingParameters'),
  configSelectors.get('defaultCustomComputeOfferingRestrictions'),
  configSelectors.get('customComputeOfferingHardwareValues'),
  UserTagsSelectors.getServiceOfferingParamTags,
  (
    account,
    offerings,
    customComputeOfferingParameters,
    defaultRestrictions,
    defaultHardwareValues,
    tags,
  ): ComputeOfferingViewModel[] => {
    /**
     * '0' used to prevent an error when account is not loaded yet
     * it happened when you go to vm creation dialog by url
     */
    const availableResources: Resources = {
      cpuNumber: (account && account.cpuavailable) || '0',
      memory: (account && account.memoryavailable) || '0',
    };
    return getComputeOfferingViewModel(
      offerings,
      customComputeOfferingParameters,
      defaultRestrictions,
      defaultHardwareValues,
      tags,
      availableResources,
    );
  },
);
