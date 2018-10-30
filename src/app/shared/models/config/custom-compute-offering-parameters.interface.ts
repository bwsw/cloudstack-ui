import { HardwareLimits } from './custom-compute-offering-hardware-restrictions.interface';

export interface CustomComputeOfferingParameters {
  offeringId: string;
  cpunumber: HardwareParameter;
  cpuspeed: HardwareParameter;
  memory: HardwareParameter;
}

interface HardwareParameter extends HardwareLimits {
  value: number;
}
