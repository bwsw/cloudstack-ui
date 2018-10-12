import { Offering } from './offering.model';
import { Tag } from './tag.model';
import { userTagKeys } from '../../tags/tag-keys';

export interface ServiceOffering extends Offering {
  created: string;
  offerha: boolean;
  limitcpuuse: boolean;
  isvolatile: boolean;
  issystem: boolean;
  defaultuse: boolean;
  cpunumber?: number;
  cpuspeed?: number;
  memory?: number;
  tags?: Array<Tag>;
  domain?: string;
  hosttags?: string;
  deploymentplanner?: string;
  networkrate?: string;
}

export const ServiceOfferingType = {
  fixed: 'Select',
  custom: 'Custom'
};

export const ServiceOfferingParamKey = userTagKeys.computeOfferingParam;
