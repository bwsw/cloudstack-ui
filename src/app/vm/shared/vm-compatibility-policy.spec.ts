import { VmCompatibilityPolicy } from './vm-compatibility-policy';
import { OfferingPolicy, ServiceOffering } from '../../shared/models';

const serviceOfferingList = require('../../../testutils/mocks/model-services/fixtures/serviceOfferings.json');

const serviceOffering = serviceOfferingList[0];

describe('VmCompatibilityPolicy', () => {
  it('should filter offering based on policy (contains all)', () => {
    const policy = {
      offeringChangePolicy: OfferingPolicy.CONTAINS_ALL,
      offeringChangePolicyIgnoreTags: ['t3'],
    };
    const currentOffering1: ServiceOffering = {
      ...serviceOffering,
      hosttags: 't1,t2,t3',
    };
    const currentOffering2: ServiceOffering = {
      ...serviceOffering,
      hosttags: 't1,t2,t4',
    };
    const newOffering: ServiceOffering = {
      ...serviceOffering,
      hosttags: 't1,t2',
    };

    const filter1 = VmCompatibilityPolicy.getFilter(policy, currentOffering1);
    const filter2 = VmCompatibilityPolicy.getFilter(policy, currentOffering2);

    expect(filter1(newOffering)).toBeTruthy();
    expect(filter2(newOffering)).toBeFalsy();
  });

  it('should filter offering based on policy (exactly match)', () => {
    const policy = {
      offeringChangePolicy: OfferingPolicy.EXACTLY_MATCH,
      offeringChangePolicyIgnoreTags: ['t2'],
    };
    const currentOffering1: ServiceOffering = {
      ...serviceOffering,
      hosttags: 't1,t2,t3',
    };
    const currentOffering2: ServiceOffering = {
      ...serviceOffering,
      hosttags: 't1,t2',
    };
    const newOffering: ServiceOffering = {
      ...serviceOffering,
      hosttags: 't1,t2',
    };

    const filter1 = VmCompatibilityPolicy.getFilter(policy, currentOffering1);
    const filter2 = VmCompatibilityPolicy.getFilter(policy, currentOffering2);

    expect(filter1(newOffering)).toBeFalsy();
    expect(filter2(newOffering)).toBeTruthy();
  });

  it('should filter offering based on policy', () => {
    const policy = {
      offeringChangePolicy: OfferingPolicy.NO_RESTRICTIONS,
      offeringChangePolicyIgnoreTags: ['t2'],
    };
    const currentOffering: ServiceOffering = {
      ...serviceOffering,
      hosttags: 't1,t2,t3',
    };
    const newOffering: ServiceOffering = {
      ...serviceOffering,
      hosttags: 't1,t2',
    };

    const filter = VmCompatibilityPolicy.getFilter(policy, currentOffering);

    expect(filter(newOffering)).toBeTruthy();
  });
});
