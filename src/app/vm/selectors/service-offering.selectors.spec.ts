import { StorageTypes } from '../../shared/models/offering.model';
import { ComputeOfferingClass, OfferingPolicy, ServiceOffering, ServiceOfferingType, Zone } from '../../shared/models';
import { ResourcesData, ResourceStats } from '../../shared/services/resource-usage.service';
import * as serviceOfferingSelectors from './service-offering.selectors';

describe('Service Offering Selectors (VM module)', () => {
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

    expect(serviceOfferingSelectors.getAvailableOfferings.projector(
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

  it('should filter offerings by classes', () => {
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
    const filtered = <ServiceOffering[]>[{
      id: '2', name: 'off2', hosttags: 't1',
      storagetype: StorageTypes.shared,
      cpunumber: 2, memory: 2
    }];

    const soClasses = [
      {
        'id': 'testClass1',
        'name': {
          'ru': 'Тест1',
          'en': 'Test1'
        },
        'description': {
          'ru': 'тестовое описание 1',
          'en': 'test description 1'
        },
        'computeOfferings': [
          '1'
        ]
      },
      {
        'id': 'testClass2',
        'name': {
          'ru': 'Тест2',
          'en': 'Test2'
        },
        'description': {
          'ru': 'тестовое описание 2',
          'en': 'test description 2'
        },
        'computeOfferings': [
          '2'
        ]
      }
    ];

    const classesMap = { 'testClass2': 'testClass2' };
    const res = list.filter(item => serviceOfferingSelectors.classesFilter(item, soClasses, classesMap));

    expect(res).toEqual(filtered);
  });

  it('should get filtered offerings', () => {
    const list = <ServiceOffering[]>[
      {
        id: '1', name: 'off1', hosttags: 't1,t2',
        storagetype: StorageTypes.local,
        cpunumber: 2, memory: 2, iscustomized: false
      },
      {
        id: '2', name: 'off2', hosttags: 't1',
        storagetype: StorageTypes.shared,
        cpunumber: 2, memory: 2, iscustomized: true
      }
    ];
    const filtered = <ServiceOffering[]>[{
      id: '2', name: 'off2', hosttags: 't1',
      storagetype: StorageTypes.shared,
      cpunumber: 2, memory: 2, iscustomized: true
    }];

    const soClasses: ComputeOfferingClass[] = [
      {
        id: 'testClass1',
        name: {
          ru: 'Тест1',
          en: 'Test1'
        },
        description: {
          ru: 'тестовое описание 1',
          en: 'test description 1'
        },
        computeOfferings: [
          '1'
        ]
      },
      {
        id: 'testClass2',
        name: {
          ru: 'Тест2',
          en: 'Test2'
        },
        description: {
          ru: 'тестовое описание 2',
          en: 'test description 2'
        },
        computeOfferings: [
          '2'
        ]
      }
    ];

    const selectedClasses = ['testClass2'];
    const query = 'off2';
    const viewMode = ServiceOfferingType.custom;

    const res = serviceOfferingSelectors.selectFilteredOfferings
      .projector(list, viewMode, selectedClasses, query, soClasses);

    expect(res).toEqual(filtered);
  });

  it('should get filtered offerings (else branch)', () => {
    const list = <ServiceOffering[]>[
      {
        id: '1', name: 'off1', hosttags: 't1,t2',
        storagetype: StorageTypes.local,
        cpunumber: 2, memory: 2, iscustomized: false
      },
      {
        id: '2', name: 'off2', hosttags: 't1',
        storagetype: StorageTypes.shared,
        cpunumber: 2, memory: 2, iscustomized: true
      }
    ];
    const filtered = <ServiceOffering[]>[{
      id: '1', name: 'off1', hosttags: 't1,t2',
      storagetype: StorageTypes.local,
      cpunumber: 2, memory: 2, iscustomized: false
    }];

    const soClasses = [
      {
        'id': 'testClass1',
        'name': {
          'ru': 'Тест1',
          'en': 'Test1'
        },
        'description': {
          'ru': 'тестовое описание 1',
          'en': 'test description 1'
        },
        'serviceOfferings': [
          '1'
        ]
      },
      {
        'id': 'testClass2',
        'name': {
          'ru': 'Тест2',
          'en': 'Test2'
        },
        'description': {
          'ru': 'тестовое описание 2',
          'en': 'test description 2'
        },
        'serviceOfferings': [
          '2'
        ]
      }
    ];

    const selectedClasses = [];
    const query = '';
    const viewMode = ServiceOfferingType.fixed;

    const res = serviceOfferingSelectors.selectFilteredOfferings
      .projector(list, viewMode, selectedClasses, query, soClasses);

    expect(res).toEqual(filtered);
  });
});
