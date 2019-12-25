import { TestBed } from '@angular/core/testing';
import { HttpAccessService } from '../../services';
import { VmHttpAddressPipe } from './vm-http-address.pipe';

describe('VmHttpAddressPipe', () => {
  let pipe: VmHttpAddressPipe;

  let httpAccessService;

  beforeEach(() => {
    httpAccessService = {
      getAddress: jasmine.createSpy().and.returnValue('http://example.com'),
    };

    TestBed.configureTestingModule({
      declarations: [VmHttpAddressPipe],
      providers: [VmHttpAddressPipe, { provide: HttpAccessService, useValue: httpAccessService }],
    }).compileComponents();

    pipe = TestBed.get(VmHttpAddressPipe);
  });

  it('should return http address of a vm', () => {
    const vm = require('../../../../testutils/mocks/model-services/fixtures/vms.json')[0];
    expect(pipe.transform(vm)).toBe('http://example.com');

    expect(httpAccessService.getAddress).toHaveBeenCalledWith(vm);
  });
});
