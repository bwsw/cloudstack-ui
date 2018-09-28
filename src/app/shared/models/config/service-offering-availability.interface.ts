export interface ServiceOfferingAvailability {
  filterOfferings: boolean;
  zones?: {
    [zoneId: string]: {
      diskOfferings: Array<string>;
      computeOfferings: Array<string>;
    };
  };
}
