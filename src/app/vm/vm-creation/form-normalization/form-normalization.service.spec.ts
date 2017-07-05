import { async, TestBed } from '@angular/core/testing';
import { MockEntityData } from '../../../../testutils/mocks/model-services/entity-data';
import { MockConfigService } from '../../../../testutils/mocks/model-services/services/mock-config.service.spec';
import {
  MockResourceUsageService
} from '../../../../testutils/mocks/model-services/services/mock-resource-usage.service.spec';
import {
  MockServiceOfferingService
} from '../../../../testutils/mocks/model-services/services/mock-service-offering.service.spec';
import { ConfigService, ResourceStats, ResourceUsageService, ServiceOfferingService } from '../../../shared/services';
import { VmCreationData } from '../data/vm-creation-data';
import { VmCreationConfigurationData } from '../vm-creation.service';
import { VmCreationFormNormalizationService } from './form-normalization.service';
import { VmCreationState } from '../data/vm-creation-state';
import { VmCreationFormState } from '../vm-creation.component';
import { ServiceOffering } from '../../../shared/models';


interface VmCreationFixture {
  configurationData: {
    [key: string]: VmCreationConfigurationData;
  };

  resourceUsage: {
    [key: string]: ResourceStats;
  }
}

const fixture: VmCreationFixture = require('./form-normalization.service.fixture.json');

fdescribe('Virtual machine creation form normalization service', () => {
  let formNormalizationService: VmCreationFormNormalizationService;
  let vmCreationData: VmCreationData;
  let vmCreationState: VmCreationState;
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
        { provide: ConfigService, useClass: MockConfigService },
        { provide: ResourceUsageService, useClass: MockResourceUsageService },
        { provide: ServiceOfferingService, useClass: MockServiceOfferingService },
        { provide: 'mockConfigServiceConfig', useValue: { value: {} } },
        { provide: 'mockResourceUsageServiceConfig', useValue: { value: {} } },
        { provide: 'mockServiceOfferingServiceConfig', useValue: { value: mockEntityData.serviceOfferings } },
        VmCreationFormNormalizationService
      ]
    });
    formNormalizationService = TestBed.get(VmCreationFormNormalizationService);
  }

  beforeEach(async(() => {
    initData();
  }));

  it('test1', () => {
    configureTestBed({
      mockServiceOfferingServiceConfig: {
        value: vmCreationData.serviceOfferings
      }
    });

    const formState: VmCreationFormState = {
      data: vmCreationData,
      state: vmCreationState
    };

    const normalizedFormState = formNormalizationService.normalize(formState);
  });
});
