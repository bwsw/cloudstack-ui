import { async, TestBed } from '@angular/core/testing';
import { MockEntityData } from '../../../../testutils/mocks/model-services/entity-data.spec';
import { MockConfigService } from '../../../../testutils/mocks/model-services/services/mock-config.service.spec';
import {
  MockCustomServiceOfferingService
} from '../../../../testutils/mocks/model-services/services/mock-custom-service-offering.service.spec';
import {
  MockResourceUsageService
} from '../../../../testutils/mocks/model-services/services/mock-resource-usage.service.spec';
import {
  MockServiceOfferingService
} from '../../../../testutils/mocks/model-services/services/mock-service-offering.service.spec';
import {
  CustomServiceOfferingService
} from '../../../service-offering/custom-service-offering/service/custom-service-offering.service';
import { ServiceOffering } from '../../../shared/models';
import { ConfigService } from '../../../shared/services/config.service';
import {
  ResourceStats,
  ResourceUsageService
} from '../../../shared/services/resource-usage.service';
import { ServiceOfferingService } from '../../../shared/services/service-offering.service';
import { VmCreationData } from '../data/vm-creation-data';
import { VmCreationState } from '../data/vm-creation-state';
import { VmCreationConfigurationData } from '../services/vm-creation.service';
import { VmCreationFormState } from '../vm-creation.component';
import { VmCreationFormNormalizationService } from './form-normalization.service';
import { AuthService } from '../../../shared/services/auth.service';


interface VmCreationFixture {
  configurationData: {
    [key: string]: VmCreationConfigurationData;
  };

  resourceUsage: {
    [key: string]: ResourceStats;
  }
}

const fixture: VmCreationFixture = require('./form-normalization.service.fixture.json');

describe('Virtual machine creation form normalization service', () => {
  let formNormalizationService: VmCreationFormNormalizationService;
  let vmCreationData: VmCreationData;
  let vmCreationState: VmCreationState;
  let formState: VmCreationFormState;
  const mockEntityData = new MockEntityData();

  function initData(): void {
    const configurationData = fixture.configurationData[0];
    const availablePrimaryStorage = 1000;
    const defaultName = 'vm-1';
    const instanceGroups = [];
    const resourceUsage: ResourceStats = fixture.resourceUsage[0];
    const rootDiskSizeLimit = 1000;

    vmCreationData = new VmCreationData(
      mockEntityData.affinityGroups,
      configurationData,
      {},
      availablePrimaryStorage,
      defaultName,
      mockEntityData.diskOfferings,
      instanceGroups,
      resourceUsage,
      rootDiskSizeLimit,
      mockEntityData.securityGroupTemplates,
      mockEntityData.serviceOfferings,
      mockEntityData.sshKeyPairs,
      mockEntityData.templates,
      mockEntityData.isos,
      mockEntityData.zones
    );
    vmCreationState = vmCreationData.getInitialState();
  }

  function configureTestBed(params?: {
    mockConfigServiceConfig?: { value: {} },
    mockResourceUsageServiceConfig?: { value: {} },
    mockServiceOfferingServiceConfig?: { value: Array<ServiceOffering> }
  }): void {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: AuthService,
          useValue: {
            getCustomDiskOfferingMinSize() {
              return 1;
            }
          }
        },
        {
          provide: ConfigService,
          useClass: MockConfigService
        },
        {
          provide: ResourceUsageService,
          useClass: MockResourceUsageService
        },
        {
          provide: ServiceOfferingService,
          useClass: MockServiceOfferingService
        },
        {
          provide: CustomServiceOfferingService,
          useClass: MockCustomServiceOfferingService
        },
        {
          provide: 'mockConfigServiceConfig',
          useValue: { value: {} }
        },
        {
          provide: 'mockResourceUsageServiceConfig',
          useValue: { value: {} }
        },
        {
          provide: 'mockServiceOfferingServiceConfig',
          useValue: { value: mockEntityData.serviceOfferings }
        },
        {
          provide: 'mockCustomServiceOfferingServiceConfig',
          useValue:
            {
              customOffering: {},
              customOfferingRestrictionsByZone: {}
            }
        },
        VmCreationFormNormalizationService
      ]
    });
    formNormalizationService = TestBed.get(VmCreationFormNormalizationService);
  }

  beforeEach(async(() => {
    initData();
    configureTestBed({
      mockServiceOfferingServiceConfig: {
        value: vmCreationData.serviceOfferings
      }
    });

    formState = {
      data: vmCreationData,
      state: vmCreationState
    };
  }));

  it('filters templates 1', () => {
    const zoneId = '031a55bb-5d6b-4336-ab93-d5dead28a887';
    formState.state.zone = formState.data.zones.find(zone => zone.id === zoneId);
    const templates = formNormalizationService.normalize(formState).data.templates;
    expect(templates.length).toBe(3);
    const templateIds = templates.map(template => template.id);
    expect(templateIds.sort()).toEqual([
      '981d0bb9-3922-4152-897e-1843a49bf59b',
      'aa991af8-3e08-4a79-b7e3-2dbabe502b10',
      '4d66e52d-bf3e-4e92-bfcb-c6d038586863'
    ].sort());
    // eee61589 is not ready
    // 7bcf6914 is in another zone and is not cross-zone
    // 5a8328bc exceeds root disk size
    // sort because order is irrelevant in template list
  });

  it('filters templates 2', () => {
    const zoneId = '3fcdb37c-1c0b-4728-b62f-970c765c3fbc';
    formState.state.zone = formState.data.zones.find(zone => zone.id === zoneId);
    const templates = formNormalizationService.normalize(formState).data.templates;
    expect(templates.length).toBe(3);
    const templateIds = templates.map(template => template.id);
    expect(templateIds.sort()).toEqual([
      '981d0bb9-3922-4152-897e-1843a49bf59b',
      '5a8328bc-ac77-4b64-8be8-df8512442799',
      '7bcf6914-be9f-4b6e-838c-cd0469561bbf'
    ].sort());
    // aa991af8 is cross-zone, but it doesn't exist in 031a55bb-5d6b-4336-ab93-d5dead28a887
  });

  it('filters isos 1', () => {
    const zoneId = '031a55bb-5d6b-4336-ab93-d5dead28a887';
    formState.state.zone = formState.data.zones.find(zone => zone.id === zoneId);
    const isos = formNormalizationService.normalize(formState).data.isos;
    expect(isos.length).toBe(4);
    const isoIds = isos.map(iso => iso.id);
    expect(isoIds.sort()).toEqual([
      '14e4e601-00ad-4635-aca9-2761ccdd8713',
      'aae96a0c-6c33-41d6-99ec-c9bb4ea3a974',
      '6a5fc80b-6fc6-4865-8b0e-b3bfc986c9a0',
      'f8230f72-13e1-4be5-baac-0a45d1619286'
    ].sort());
    // 188bc550 exceeds root disk size
  });

  it('filters isos 2', () => {
    const zoneId = '3fcdb37c-1c0b-4728-b62f-970c765c3fbc';
    formState.state.zone = formState.data.zones.find(zone => zone.id === zoneId);
    const isos = formNormalizationService.normalize(formState).data.isos;
    expect(isos.length).toBe(0);
  });

  it('does not show resize if template is selected', () => {
    const zoneId = '031a55bb-5d6b-4336-ab93-d5dead28a887';
    const templateId = '5a8328bc-ac77-4b64-8be8-df8512442799';
    formState.state.zone = formState.data.zones.find(zone => zone.id === zoneId);
    formState.state.template = formState.data.templates.find(
      template => template.id === templateId);
    formState = formNormalizationService.normalize(formState);
    expect(formState.state.diskOfferingsAreAllowed).toBe(false);
  });

  it('filters disk offerings 2', () => {
    const zoneId = '031a55bb-5d6b-4336-ab93-d5dead28a887';
    const iso8GB = '14e4e601-00ad-4635-aca9-2761ccdd8713';
    formState.state.zone = formState.data.zones.find(zone => zone.id === zoneId);
    formState.state.template = formState.data.isos.find(iso => iso.id === iso8GB);
    const diskOfferings = formNormalizationService.normalize(formState).data.diskOfferings;
    expect(diskOfferings.length).toBe(3);
    const diskOfferingIds = diskOfferings.map(diskOffering => diskOffering.id);
    expect(diskOfferingIds.sort()).toEqual([
      'b785e23e-5159-4968-ba6e-3ddb9fa1d58e',
      '6d135a79-cf3b-4eae-86c5-89884255c90d',
      'c201d261-16bb-46ba-b831-e1715e5238e3'
    ].sort());
  });

  it('filters disk offerings 3', () => {
    const zoneId = '031a55bb-5d6b-4336-ab93-d5dead28a887';
    const iso500GB = 'aae96a0c-6c33-41d6-99ec-c9bb4ea3a974';
    formState.state.zone = formState.data.zones.find(zone => zone.id === zoneId);
    formState.state.template = formState.data.isos.find(iso => iso.id === iso500GB);
    const diskOfferings = formNormalizationService.normalize(formState).data.diskOfferings;
    expect(diskOfferings.length).toBe(2);
    const diskOfferingIds = diskOfferings.map(diskOffering => diskOffering.id);
    expect(diskOfferingIds.sort()).toEqual([
      'b785e23e-5159-4968-ba6e-3ddb9fa1d58e',
      '6d135a79-cf3b-4eae-86c5-89884255c90d'
    ].sort());
  });

  it('filters disk offerings 4', () => {
    const zoneId = '031a55bb-5d6b-4336-ab93-d5dead28a887';
    const iso2TB = '188bc550-7216-42fb-9d24-520e835b31b9';
    formState.state.zone = formState.data.zones.find(zone => zone.id === zoneId);
    formState.state.template = formState.data.isos.find(iso => iso.id === iso2TB);
    formState.data.rootDiskSizeLimit = 1000000000000; // otherwise iso will change because it doesn't fit
    const diskOfferings = formNormalizationService.normalize(formState).data.diskOfferings;
    expect(diskOfferings.length).toBe(1);
    expect(formState.data.diskOfferings[0].id)
      .toBe('b785e23e-5159-4968-ba6e-3ddb9fa1d58e');
  });

  it('filters disk size 1', () => {
    const zoneId = '031a55bb-5d6b-4336-ab93-d5dead28a887';
    const isoId = '6a5fc80b-6fc6-4865-8b0e-b3bfc986c9a0';
    formState.state.zone = formState.data.zones.find(zone => zone.id === zoneId);
    formState.state.template = formState.data.isos.find(iso => iso.id === isoId);
    formState = formNormalizationService.normalize(formState);
    expect(formState.state.rootDiskSize).toBe(1);
  });

  it('filters disk size 2', () => {
    const zoneId = '031a55bb-5d6b-4336-ab93-d5dead28a887';
    const isoId = '14e4e601-00ad-4635-aca9-2761ccdd8713';
    formState.state.zone = formState.data.zones.find(zone => zone.id === zoneId);
    formState.state.template = formState.data.isos.find(iso => iso.id === isoId);
    formState = formNormalizationService.normalize(formState);
    expect(formState.state.rootDiskSize).toBe(formState.state.template.sizeInGB);
  });
});
