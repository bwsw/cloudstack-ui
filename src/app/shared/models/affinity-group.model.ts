import { BaseModel } from './base.model';

export enum AffinityGroupType {
  antiAffinity = 'host anti-affinity',
  affinity = 'host affinity',
}

export const affinityGroupTypesMap = {
  'host anti-affinity': 'anti-affinity',
  'host affinity': 'affinity',
};

export const emptyAffinityGroup = 'NO_AFFINITY_GROUP';

export interface AffinityGroup extends BaseModel {
  id: string;
  name: string;
  type: AffinityGroupType;
  description?: string;
  virtualmachineids?: string[];
  // custom
  isPreselected?: boolean;
}
