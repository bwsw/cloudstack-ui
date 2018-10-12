import { CustomComputeOfferingHardwareRestrictions, ServiceOffering } from '../../shared/models';

export interface ComputeOfferingViewModel extends ServiceOffering {
  isAvailableByResources: boolean;
  customOfferingRestrictions?: CustomComputeOfferingHardwareRestrictions;
}
