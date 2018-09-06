import { ComputeOfferingRestrictions, ServiceOffering } from '../../shared/models';

export interface ComputeOfferingViewModel extends ServiceOffering {
  // this properties only for custom compute offerings
  restrictions?: ComputeOfferingRestrictions;
  defaultValues?: {
    cpunumber: number;
    cpuspeed: number;
    memory: number;
  };
}
