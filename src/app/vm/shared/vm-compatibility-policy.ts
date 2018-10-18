import { ServiceOffering } from '../../shared/models';
import { OfferingCompatibilityPolicy, OfferingPolicy } from '../../shared/models/config';

export class VmCompatibilityPolicy {
  public static getFilter(
    compatibilityPolicy: OfferingCompatibilityPolicy,
    currentOffering: ServiceOffering,
  ) {
    const filter = (offering: ServiceOffering) => {
      if (!compatibilityPolicy) {
        return true;
      }
      const oldTags = currentOffering.hosttags ? currentOffering.hosttags.split(',') : [];
      const newTags = offering.hosttags ? offering.hosttags.split(',') : [];
      return this.matchHostTags(oldTags, newTags, compatibilityPolicy);
    };

    return filter;
  }

  private static matchHostTags(
    oldTags: string[],
    newTags: string[],
    compatibilityPolicy: OfferingCompatibilityPolicy,
  ) {
    const ignoreTags = compatibilityPolicy.offeringChangePolicyIgnoreTags;
    if (ignoreTags) {
      // tslint:disable:no-parameter-reassignment
      oldTags = this.filterTags(oldTags, ignoreTags);
      newTags = this.filterTags(newTags, ignoreTags);
      // tslint:enable:no-parameter-reassignment
    }
    switch (compatibilityPolicy.offeringChangePolicy) {
      case OfferingPolicy.CONTAINS_ALL: {
        return this.includeTags(oldTags, newTags);
      }
      case OfferingPolicy.EXACTLY_MATCH: {
        return oldTags.length === newTags.length ? this.includeTags(oldTags, newTags) : false;
      }
      case OfferingPolicy.NO_RESTRICTIONS:
      default: {
        return true;
      }
    }
  }

  private static filterTags(tags, ignoreTags) {
    return tags.filter(t => ignoreTags.indexOf(t) === -1);
  }

  private static includeTags(oldTags: string[], newTags: string[]) {
    return !oldTags.find(tag => newTags.indexOf(tag) === -1);
  }
}
