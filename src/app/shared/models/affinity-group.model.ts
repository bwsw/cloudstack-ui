import { BaseModel } from './base.model';

export enum AffinityGroupType {
  hostAntiAffinity = 'host anti-affinity',
}

export interface AffinityGroup extends BaseModel {
  id: string;
  name: string;
  description: string;
  type: AffinityGroupType;
  virtualmachineids: string[];
}
