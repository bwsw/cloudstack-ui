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

export const getGroupId = (item: ServiceOffering) => {
  const tag = item.tags && item.tags.find(
    _ => _.key === ServiceOfferingGroupKey);
  return tag && tag.value;
};

export class ServiceOfferingGroup {
  public id: string;
  public translations?: string;

  constructor(id: string) {
    this.id = id;
  }
}

export const ServiceOfferingType = {
  select: 'Select',
  custom: 'Custom'
};

export const ServiceOfferingGroupKey = 'csui.service-offering.group';
export const DefaultServiceOfferingGroupId = 'common';
