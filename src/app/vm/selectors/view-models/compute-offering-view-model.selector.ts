import { createSelector } from '@ngrx/store';

import { ServiceOffering, ServiceOfferingParamKey, Tag } from '../../../shared/models';
import {
  CustomComputeOfferingHardwareRestrictions,
  CustomComputeOfferingHardwareValues,
  CustomComputeOfferingParameters,
  HardwareLimits
} from '../../../shared/models/config';
import { ComputeOfferingViewModel } from '../../view-models';
import { configSelectors, UserTagsSelectors } from '../../../root-store';
import * as computeOffering from '../../../reducers/service-offerings/redux/service-offerings.reducers';

const getFixedAndCustomOfferingsArrays = (offerings: ServiceOffering[]) => {
  const offeringsArrays = {
    customOfferings: [],
    fixedOfferings: []
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
  offeringsParameters: CustomComputeOfferingParameters[]
): CustomComputeOfferingParameters | undefined => {
  return offeringsParameters.find(parameters => parameters.offeringId === offering.id)
};

const getCustomHardwareValues = (
  params: CustomComputeOfferingParameters | undefined
): CustomComputeOfferingHardwareValues | null => {
  if (!params) {
    return null;
  }

  return {
    cpunumber: params.cpunumber.value,
    cpuspeed: params.cpuspeed.value,
    memory: params.memory.value
  }
};

const getCustomHardwareRestrictions = (
  params: CustomComputeOfferingParameters | undefined
): CustomComputeOfferingHardwareRestrictions | null => {
  if (!params) {
    return null;
  }

  return {
    cpunumber: {
      min: params.cpunumber.min,
      max: params.cpunumber.max
    },
    cpuspeed: {
      min: params.cpuspeed.min,
      max: params.cpuspeed.max
    },
    memory: {
      min: params.memory.min,
      max: params.memory.max
    }
  }
};

const getHardwareValuesFromTags = (
  serviceOffering: ComputeOfferingViewModel,
  tags: Tag[]
): CustomComputeOfferingHardwareValues | null => {
  const getValue = (param) => {
    const key = `${ServiceOfferingParamKey}.${serviceOffering.id}.${param}`;
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

const getValueThatSatisfiesRestrictions = (defaultValue: number, restrictions: HardwareLimits) => {
  if (restrictions.min > defaultValue) {
    return restrictions.min;
  } else if (defaultValue > restrictions.max) {
    return restrictions.max;
  }

  return defaultValue;
};

export const getComputeOfferingViewModel = createSelector(
  computeOffering.selectAll,
  configSelectors.get('customComputeOfferingParameters'),
  configSelectors.get('defaultCustomComputeOfferingRestrictions'),
  configSelectors.get('customComputeOfferingHardwareValues'),
  UserTagsSelectors.getServiceOfferingParamTags,
  (
    offerings,
    customComputeOfferingParameters,
    defaultRestrictions,
    defaultHardwareValues,
    tags
  ): ComputeOfferingViewModel[] => {
    const { customOfferings, fixedOfferings } = getFixedAndCustomOfferingsArrays(offerings);

    const customOfferingsWithMetadata: ComputeOfferingViewModel[] = customOfferings
      .map((offering: ServiceOffering) => {
        const customParameters = getCustomOfferingHardwareParameters(offering, customComputeOfferingParameters);
        const customHardwareValues = getCustomHardwareValues(customParameters);
        const customHardwareRestrictions = getCustomHardwareRestrictions(customParameters);
        const hardwareValuesFromTags = getHardwareValuesFromTags(offering, tags);

        const prioritizedHardwareValues = hardwareValuesFromTags || customHardwareValues || defaultHardwareValues;
        const prioritizedRestrictions = customHardwareRestrictions || defaultRestrictions;

        const cpunumber = getValueThatSatisfiesRestrictions(
          prioritizedHardwareValues.cpunumber, prioritizedRestrictions.cpunumber);
        const cpuspeed = getValueThatSatisfiesRestrictions(
          prioritizedHardwareValues.cpuspeed, prioritizedRestrictions.cpuspeed);
        const memory = getValueThatSatisfiesRestrictions(
          prioritizedHardwareValues.memory, prioritizedRestrictions.memory);


        const offeringViewModel: ComputeOfferingViewModel = {
          ...offering,
          cpunumber,
          cpuspeed,
          memory,
          customOfferingRestrictions: prioritizedRestrictions
        };
        return offeringViewModel;
      });

    return [...fixedOfferings, ...customOfferingsWithMetadata];
  }
);
