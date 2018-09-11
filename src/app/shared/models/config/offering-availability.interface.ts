export interface OfferingAvailability {
  filterOfferings: boolean;
  zones?: {
    [zoneId: string]: {
      diskOfferings: Array<string>,
      serviceOfferings: Array<string>
    }
  }
}
