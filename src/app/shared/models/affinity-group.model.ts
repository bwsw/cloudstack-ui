import { BaseModel } from './base.model';


export enum AffinityGroupType {
  antiAffinity = 'host anti-affinity',
  affinity = 'host affinity'
}

export const AffinityGroupTypesMap = {
  'host anti-affinity': 'anti-affinity',
  'host affinity': 'affinity'
};


export interface AffinityGroup extends BaseModel {
  id: string;
  name: string;
  type: AffinityGroupType;
  description?: string;
  virtualmachineids?: Array<string>;
  // custom
  isPreselected?: boolean;
}
