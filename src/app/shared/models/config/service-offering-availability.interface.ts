export interface ServiceOfferingAvailability {
  filterOfferings: boolean;
  zones?: {
    [zoneId: string]: {
      diskOfferings: string[];
      computeOfferings: string[];
    };
  };
}
