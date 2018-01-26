import { CustomServiceOffering } from '../../../service-offering/custom-service-offering/custom-service-offering';
import { StorageTypes } from '../../../shared/models/offering.model';
import { ServiceOffering } from '../../../shared/models/service-offering.model';
import { Zone } from '../../../shared/models/zone.model';
import { OfferingPolicy } from '../../../shared/services/offering.service';
import {
  ResourcesData,
  ResourceStats
} from '../../../shared/services/resource-usage.service';
import {
  LOAD_COMPATIBILITY_POLICY_RESPONSE,
  LOAD_CUSTOM_RESTRICTION_RESPONSE,
  LOAD_DEFAULT_PARAMS_RESPONSE,
  LOAD_OFFERING_AVAILABILITY_RESPONSE,
  LOAD_SERVICE_OFFERINGS_REQUEST,
  LOAD_SERVICE_OFFERINGS_RESPONSE
} from './service-offerings.actions';
import * as fromSOs from './service-offerings.reducers';

describe('Test service offering reducer', () => {

  it('should handle initial state', () => {
    const state = fromSOs.reducer(undefined, { type: '' });
    expect(state)
      .toEqual({
        ids: [],
        entities: {},
        loading: false,
        offeringAvailability: {},
        defaultParams: {},
        customOfferingRestrictions: {},
        offeringCompatibilityPolicy: {
          offeringChangePolicy: OfferingPolicy.NO_RESTRICTIONS
        }
      });
  });

  it('should set loading', () => {
    const state = fromSOs.reducer(undefined, { type: LOAD_SERVICE_OFFERINGS_REQUEST });
    expect(state)
      .toEqual({
        ids: [],
        entities: {},
        loading: true,
        offeringAvailability: {},
        defaultParams: {},
        customOfferingRestrictions: {},
        offeringCompatibilityPolicy: {
          offeringChangePolicy: OfferingPolicy.NO_RESTRICTIONS
        }
      });
  });

  it('should set entities', () => {
    const state = fromSOs.reducer(undefined, {
      type: LOAD_SERVICE_OFFERINGS_RESPONSE,
      payload: [{ id: '1', name: 'off1' }, { id: '2', name: 'off2' }]
    });
    expect(state)
      .toEqual(<any>{
        ids: ['1', '2'],
        entities: { 1: { id: '1', name: 'off1' }, 2: { id: '2', name: 'off2' } },
        loading: false,
        offeringAvailability: {},
        defaultParams: {},
        customOfferingRestrictions: {},
        offeringCompatibilityPolicy: {
          offeringChangePolicy: OfferingPolicy.NO_RESTRICTIONS
        }
      });
  });

  it('should set configuration constant', () => {
    let state = fromSOs.reducer(undefined, {
      type: LOAD_OFFERING_AVAILABILITY_RESPONSE,
      payload: { 'filterOfferings': false }
    });
    expect(state)
      .toEqual(<any>{
        ids: [],
        entities: {},
        loading: false,
        offeringAvailability: { 'filterOfferings': false },
        defaultParams: {},
        customOfferingRestrictions: {},
        offeringCompatibilityPolicy: {
          offeringChangePolicy: OfferingPolicy.NO_RESTRICTIONS
        }
      });

    state = fromSOs.reducer(state, {
      type: LOAD_CUSTOM_RESTRICTION_RESPONSE,
      payload: { 'custom': 'r1' }
    });

    expect(state)
      .toEqual(<any>{
        ids: [],
        entities: {},
        loading: false,
        offeringAvailability: { 'filterOfferings': false },
        defaultParams: {},
        customOfferingRestrictions: { 'custom': 'r1' },
        offeringCompatibilityPolicy: {
          offeringChangePolicy: OfferingPolicy.NO_RESTRICTIONS
        }
      });

    state = fromSOs.reducer(state, {
      type: LOAD_DEFAULT_PARAMS_RESPONSE,
      payload: { 'default': 'd1' }
    });

    expect(state)
      .toEqual(<any>{
        ids: [],
        entities: {},
        loading: false,
        offeringAvailability: { 'filterOfferings': false },
        defaultParams: { 'default': 'd1' },
        customOfferingRestrictions: { 'custom': 'r1' },
        offeringCompatibilityPolicy: {
          offeringChangePolicy: OfferingPolicy.NO_RESTRICTIONS
        }
      });

    state = fromSOs.reducer(state, {
      type: LOAD_COMPATIBILITY_POLICY_RESPONSE,
      payload: {
        'offeringChangePolicy': 'no-restrictions',
        'offeringChangePolicyIgnoreTags': ['t1']
      }
    });

    expect(state)
      .toEqual(<any>{
        ids: [],
        entities: {},
        loading: false,
        offeringAvailability: { 'filterOfferings': false },
        defaultParams: { 'default': 'd1' },
        customOfferingRestrictions: { 'custom': 'r1' },
        offeringCompatibilityPolicy: {
          offeringChangePolicy: 'no-restrictions',
          offeringChangePolicyIgnoreTags: ['t1']
        }
      });
  });

  it('should get state', () => {
    const state = fromSOs.reducer(undefined, {
      type: LOAD_SERVICE_OFFERINGS_RESPONSE,
      payload: [{ id: '1', name: 'off1' }, { id: '2', name: 'off2' }]
    });
    expect(state)
      .toEqual(<any>{
        ids: ['1', '2'],
        entities: { 1: { id: '1', name: 'off1' }, 2: { id: '2', name: 'off2' } },
        loading: false,
        offeringAvailability: {},
        defaultParams: {},
        customOfferingRestrictions: {},
        offeringCompatibilityPolicy: {
          offeringChangePolicy: OfferingPolicy.NO_RESTRICTIONS
        }
      });
    expect(fromSOs.getOfferingsEntitiesState.projector({ list: state })).toBe(state);
    expect(fromSOs.isLoading.projector(state)).toBe(false);
    expect(fromSOs.getSelectedOffering.projector(
      state.entities,
      { serviceOfferingId: 1 }
    ))
      .toEqual({ id: '1', name: 'off1' });
  });

  it('should get available by resources (Sync)', () => {
    const list = <ServiceOffering[]>[
      {
        id: '1',
        name: 'off1',
        hosttags: 't1,t2',
        cpunumber: 2,
        memory: 2
      },
      {
        id: '2',
        name: 'off2',
        hosttags: 't1',
        iscustomized: true,
        cpunumber: 2,
        memory: 2
      }
    ];
    const resourceUsage = {
      available: new ResourcesData(),
      consumed: new ResourcesData(),
      max: new ResourcesData()
    };
    resourceUsage.available.cpus = 2;
    resourceUsage.available.memory = 2;

    const result = fromSOs.getAvailableByResourcesSync(
      list,
      {
        '1': {
          filterOfferings: true,
          diskOfferings: [],
          serviceOfferings: ['1', '2'],
        }
      },
      { '1': { cpunumber: { min: 1 }, memory: { min: 1 } } },
      resourceUsage,
      <Zone>{ id: '1' }
    );

    expect(result).toEqual(list);
  });

  it('should check is offering available in zone', () => {
    const offering = <ServiceOffering>{
      id: '1', name: 'off1', hosttags: 't1,t2',
      cpunumber: 2, memory: 2, storagetype: StorageTypes.shared
    };

    const result1 = fromSOs.isOfferingAvailableInZone(
      offering,
      {
        '1': {
          filterOfferings: true,
          diskOfferings: [],
          serviceOfferings: ['1', '2'],
        }
      },
      <Zone>{ id: '1' }
    );
    expect(result1).toEqual(true);

    const result2 = fromSOs.isOfferingAvailableInZone(
      offering,
      {
        '1': {
          filterOfferings: false,
          diskOfferings: [],
          serviceOfferings: ['1', '2'],
        }
      },
      <Zone>{ id: '1' }
    );
    expect(result2).toEqual(true);
  });

  it('should get offerings available in zone', () => {
    const list = <ServiceOffering[]>[
      {
        id: '1', name: 'off1', hosttags: 't1,t2',
        cpunumber: 2, memory: 2, storagetype: StorageTypes.shared
      },
      {
        id: '2', name: 'off2', hosttags: 't1', iscustomized: true,
        cpunumber: 2, memory: 2, storagetype: StorageTypes.local
      }
    ];

    const result1 = fromSOs.getOfferingsAvailableInZone(
      list,
      {
        '1': {
          filterOfferings: true,
          diskOfferings: [],
          serviceOfferings: ['1', '2'],
        }
      },
      <Zone>{ id: '1', localstorageenabled: false }
    );
    expect(result1).toEqual([list[0]]);

    const result2 = fromSOs.getOfferingsAvailableInZone(
      list,
      {
        '1': {
          filterOfferings: false,
          diskOfferings: [],
          serviceOfferings: ['1', '2'],
        }
      },
      <Zone>{ id: '1', localstorageenabled: false }
    );
    expect(result2).toEqual(list);
  });

  it('should get restriction intersection', () => {
    const resourceUsage = {
      available: new ResourcesData(),
      consumed: new ResourcesData(),
      max: new ResourcesData()
    };
    resourceUsage.available.cpus = 2;
    resourceUsage.available.memory = 2;

    const result1 = fromSOs.getRestrictionIntersection(
      { cpunumber: { min: 1, max: 2 }, memory: { min: 1, max: 2 } },
      resourceUsage
    );
    expect(result1).toEqual({
      cpunumber: { max: 2, min: 1 },
      memory: { max: 2, min: 1 }
    });

    const result2 = fromSOs.getRestrictionIntersection(
      null,
      resourceUsage
    );
    expect(result2).toEqual({
      cpunumber: { max: 2 },
      memory: { max: 2 }
    });

    const result3 = fromSOs.getRestrictionIntersection(
      {
        cpunumber: { min: 1, max: 2 },
        memory: { min: 1, max: 2 },
        cpuspeed: { min: 1, max: 2 }
      },
      resourceUsage
    );
    expect(result3).toEqual(<any>{
      cpunumber: { max: 2, min: 1 },
      memory: { max: 2, min: 1 },
      cpuspeed: { min: 1, max: 2 }
    });
  });

  it('should check is restriction compatible', () => {
    const result1 = fromSOs.restrictionsAreCompatible(
      { cpunumber: { min: 1, max: 2 }, memory: { min: 1, max: 2 } }
    );
    expect(result1).toEqual(true);
    const result2 = fromSOs.restrictionsAreCompatible(
      { cpunumber: { min: 1, max: 0 }, memory: { min: 1 } }
    );
    expect(result2).toEqual(false);

  });

  it('should return clip offering params to restrictions', () => {
    const result1 = fromSOs.clipOfferingParamsToRestrictions(
      { cpunumber: 2, memory: 2, cpuspeed: 2 },
      { cpunumber: { min: 1 }, memory: { min: 1 } },
    );
    expect(result1).toEqual({ cpunumber: 2, memory: 2, cpuspeed: 2 });

    const result2 = fromSOs.clipOfferingParamsToRestrictions(
      { cpunumber: 2, memory: 2, cpuspeed: 2 },
      { cpunumber: { min: 3 }, memory: { max: 1 } },
    );
    expect(result2).toEqual({ cpunumber: 3, memory: 1, cpuspeed: 2 });

  });

  it('should get custom offering with set params', () => {
    const offering = <ServiceOffering>{
      id: '2', name: 'off2', hosttags: 't1',
      iscustomized: true, cpunumber: 2, memory: 2
    };
    const resourceUsage = {
      available: new ResourcesData(),
      consumed: new ResourcesData(),
      max: new ResourcesData()
    };
    resourceUsage.available.cpus = 2;
    resourceUsage.available.memory = 2;

    const result1 = fromSOs.getCustomOfferingWithSetParams(
      offering,
      {},
      { cpunumber: { min: 1 }, memory: { min: 1 }, cpuspeed: { min: 1 } },
      resourceUsage
    );

    expect(result1)
      .toEqual({...offering, cpunumber: 2, memory: 2, cpuspeed: 1 });
  });

  it('should compare tags', () => {
    expect(fromSOs.includeTags(['t1', 't2'], ['t1', 't3'])).toBeFalsy();
    expect(fromSOs.includeTags(['t1', 't2'], ['t2', 't1'])).toBeTruthy();
  });

  it('should match host tags', () => {
    const oldTags = ['t1', 't2', 't3'];
    const newTags = ['t1', 't2'];
    const policy1 = {
      offeringChangePolicy: OfferingPolicy.CONTAINS_ALL,
      offeringChangePolicyIgnoreTags: ['t3']
    };
    expect(fromSOs.matchHostTags(oldTags, newTags, policy1)).toBeTruthy();
    expect(fromSOs.matchHostTags(['t1', 't3', 't4'], newTags, policy1)).toBeFalsy();
    const policy2 = {
      offeringChangePolicy: OfferingPolicy.EXACTLY_MATCH,
      offeringChangePolicyIgnoreTags: ['t2']
    };
    expect(fromSOs.matchHostTags(oldTags, newTags, policy2)).toBeFalsy();
    expect(fromSOs.matchHostTags(['t1', 't2'], newTags, policy2)).toBeTruthy();
    const policy3 = {
      offeringChangePolicy: OfferingPolicy.NO_RESTRICTIONS,
      offeringChangePolicyIgnoreTags: ['t2']
    };
    expect(fromSOs.matchHostTags(oldTags, newTags, policy3)).toBeTruthy();
  });

  it('should get available offerings', () => {
    const list = <ServiceOffering[]>[
      {
        id: '1', name: 'off1', hosttags: 't1,t2',
        storagetype: StorageTypes.local,
        cpunumber: 2, memory: 2
      },
      {
        id: '2', name: 'off2', hosttags: 't1',
        storagetype: StorageTypes.shared,
        cpunumber: 2, memory: 2
      }
    ];
    const offering = {
      id: '2', name: 'off2', hosttags: 't1',
      storagetype: StorageTypes.shared,
      cpunumber: 2, memory: 2
    };

    const policy = {
      offeringChangePolicy: OfferingPolicy.EXACTLY_MATCH,
      offeringChangePolicyIgnoreTags: ['t2']
    };
    const resourceUsage = {
      available: new ResourcesData(),
      consumed: new ResourcesData(),
      max: new ResourcesData()
    };
    resourceUsage.available.cpus = 2;
    resourceUsage.available.memory = 2;
    spyOn(ResourceStats, 'fromAccount').and.returnValue(resourceUsage);

    expect(fromSOs.getAvailableOfferings.projector(
      list,
      offering,
      {
        '1': {
          filterOfferings: true,
          diskOfferings: [],
          serviceOfferings: ['1', '2'],
        }
      },
      {},
      { cpunumber: { min: 1, max: 2 }, memory: { min: 1, max: 2 } },
      policy,
      <Zone>{ id: '1', localstorageenabled: false },
      {}
    ))
      .toEqual([list[1]]);
  });


});
