import { createSelector } from '@ngrx/store';

import { ServiceOffering, ServiceOfferingParamKey, Tag } from '../../../shared/models';
import { CustomComputeOfferingRestrictions } from '../../../shared/models/config';
import { ComputeOfferingViewModel } from '../../view-models';
import { configSelectors } from '../../../root-store';
import * as fromAccountTags from '../../../reducers/account-tags/redux/account-tags.reducers';
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

const getCustomOfferingRestrictions = (
  offering: ServiceOffering,
  customRestrictions: CustomComputeOfferingRestrictions[]
) => {
  return customRestrictions.find(restriction => restriction.offeringId === offering.id)
};

const getHardwareParamsFromTags = (
  serviceOffering: ComputeOfferingViewModel,
  tags: Tag[]
): { cpunumber: number, cpuspeed: number, memory: number } | null => {
  const getValue = (param) => {
    const key = `${ServiceOfferingParamKey}.${serviceOffering.id}.${param}`;
    const tag = tags.find(t => t.key === key);
    return tag && tag.value;
  };

  const cpunumber = parseInt(getValue('cpuNumber'), 10);
  const cpuspeed = parseInt(getValue('cpuSpeed'), 10);
  const memory = parseInt(getValue('memory'), 10);

  if (cpunumber && cpuspeed && memory) {
    return { cpunumber, cpuspeed, memory };
  }
  return null;
};

export const getComputeOfferingViewModel = createSelector(
  computeOffering.selectAll,
  configSelectors.get('customComputeOfferingRestrictions'),
  configSelectors.get('defaultCustomComputeOfferingRestrictions'),
  configSelectors.get('customComputeOfferingParams'),
  fromAccountTags.selectServiceOfferingParamTags,
  (offerings, restrictions, defaultRestrictions, hardwareParams, tags): ComputeOfferingViewModel[] => {
    const { customOfferings, fixedOfferings } = getFixedAndCustomOfferingsArrays(offerings);

    const customOfferingsWithMetadata: ComputeOfferingViewModel[] = customOfferings.map(offering => {
      const customRestrictions = getCustomOfferingRestrictions(offering, restrictions);
      const hardwareParamsFromTags = getHardwareParamsFromTags(offering, tags);

      return {
        ...offering,
        restrictions: customRestrictions || defaultRestrictions,
        defaultValues: hardwareParamsFromTags || hardwareParams
      }
    });

    return [...fixedOfferings, ...customOfferingsWithMetadata];
  }
);
