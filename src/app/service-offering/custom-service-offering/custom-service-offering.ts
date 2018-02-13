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

export interface DefaultServiceOfferingConfigurationByZone {
  [zone: string]: DefaultServiceOfferingConfiguration;
}

export interface DefaultServiceOfferingConfiguration {
  offering: string;
  customOfferingParams: CustomServiceOffering;
}

export const customServiceOfferingFallbackParams = {
  cpunumber: 1,
  cpuspeed: 1000,
  memory: 512
};
