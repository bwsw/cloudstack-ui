export interface OfferingCompatibilityPolicy {
  offeringChangePolicy?: OfferingPolicy;
  offeringChangePolicyIgnoreTags?: string[];
}

export enum OfferingPolicy {
  CONTAINS_ALL = 'contains-all',
  EXACTLY_MATCH = 'exactly-match',
  NO_RESTRICTIONS = 'no-restrictions',
}
