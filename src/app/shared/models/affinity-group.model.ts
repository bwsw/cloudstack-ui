import { BaseModelInterface } from './base.model';


export enum AffinityGroupType {
  hostAntiAffinity = 'host anti-affinity'
}

export interface AffinityGroup extends BaseModelInterface {
  id: string;
  name: string;
  description: string;
  type: AffinityGroupType;
  virtualmachineids: Array<string>;
}
