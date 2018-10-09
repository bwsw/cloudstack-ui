export interface CustomComputeOfferingHardwareRestrictions {
  cpunumber: HardwareLimits;
  cpuspeed: HardwareLimits;
  memory: HardwareLimits;
}

export interface HardwareLimits {
  min: number;
  max: number;
}
