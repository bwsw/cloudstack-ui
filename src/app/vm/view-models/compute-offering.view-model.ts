import { ComputeOfferingRestrictions, ServiceOffering } from '../../shared/models';

export interface ComputeOfferingViewModel extends ServiceOffering {
  // this property only for custom compute offerings
  restrictions?: ComputeOfferingRestrictions;
}
