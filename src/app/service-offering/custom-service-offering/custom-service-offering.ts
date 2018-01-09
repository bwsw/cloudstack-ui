import { ServiceOffering } from '../../shared/models';

export interface ICustomServiceOffering {
  cpunumber?: number;
  cpuspeed?: number;
  memory?: number;
}

export interface CustomServiceOffering extends ServiceOffering {
  cpunumber: number;
  cpuspeed: number;
  memory: number;
}

export const areCustomParamsSet = (offering: CustomServiceOffering) => [
  offering.cpunumber,
  offering.cpuspeed,
  offering.memory
].every(_ => _ != null);
