export interface ComputeOfferingRestrictions {
  cpunumber: HardwareParameterLimits;
  cpuspeed: HardwareParameterLimits;
  memory: HardwareParameterLimits;
}

export interface CustomComputeOfferingRestrictions extends ComputeOfferingRestrictions {
  offeringId?: string;
}

export interface HardwareParameterLimits {
  min: number;
  max: number;
}

export type DefaultCustomComputeOfferingRestrictions = ComputeOfferingRestrictions;
