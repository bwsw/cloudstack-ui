import { Offering } from './offering.model';
import { Tag } from './tag.model';
import { userTagKeys } from '../../tags/tag-keys';

export interface ServiceOffering extends Offering {
  created: string;
  cpunumber: number;
  cpuspeed: number;
  memory: number;
  networkrate: string;
  offerha: boolean;
  limitcpuuse: boolean;
  isvolatile: boolean;
  issystem: boolean;
  defaultuse: boolean;
  deploymentplanner: string;
  domain: string;
  hosttags: string;
  tags: Array<Tag>;
}

export const ServiceOfferingType = {
  fixed: 'Select',
  custom: 'Custom',
};

export const ServiceOfferingParamKey = userTagKeys.computeOfferingParam;
