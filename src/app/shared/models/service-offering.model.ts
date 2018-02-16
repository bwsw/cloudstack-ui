import { AccountTagKeys } from '../services/tags/account-tag-keys';
import { Offering } from './offering.model';
import { Tag } from './tag.model';

export interface ServiceOffering extends Offering {
  resourceType: 'ServiceOffering';
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

export class ServiceOfferingClass {
  public id: string;
  public name?: object;
  public description?: object;
  public serviceOfferings?: string[];

  constructor(id: string) {
    this.id = id;
  }
}

export const ServiceOfferingType = {
  fixed: 'Select',
  custom: 'Custom'
};

export const ServiceOfferingParamKey = AccountTagKeys.serviceOfferingParam;
export const DefaultServiceOfferingClassId = 'common';
