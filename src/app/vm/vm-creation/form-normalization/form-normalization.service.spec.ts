import { async, TestBed } from '@angular/core/testing';
import { ServiceOfferingFilterService } from '../../../shared/services';
import { VmCreationFormNormalizationService } from './form-normalization.service';


describe('Virtual machine creation form normalization service', () => {
  let formNormalization: VmCreationFormNormalizationService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [ServiceOfferingFilterService]
    });

    formNormalization = TestBed.get(VmCreationFormNormalizationService);
  }));

  it('test1', () => {});
});
