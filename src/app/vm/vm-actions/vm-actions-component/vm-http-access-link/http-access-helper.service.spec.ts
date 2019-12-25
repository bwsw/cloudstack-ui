import { HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { HttpAccessService } from '../../../services';

import { HttpAccessHelperService } from './http-access-helper.service';
import { VmReachability } from './vm-reachability.enum';

describe('HttpAccessHelperService', () => {
  let service: HttpAccessHelperService;

  let http;
  let httpAccess;

  let reachable = true;
  const address = 'http://example.com';
  const vm = require('../../../../../testutils/mocks/model-services/fixtures/vms.json')[0];

  beforeEach(() => {
    reachable = true;
    http = {
      get: jasmine.createSpy().and.callFake(() => of({ reachable, url: address })),
    };

    httpAccess = {
      getAddress: jasmine.createSpy().and.returnValue(address),
    };
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: HttpClient, useValue: http },
        { provide: HttpAccessService, useValue: httpAccess },
      ],
    });

    service = TestBed.get(HttpAccessHelperService);
  });

  function ensureReachable(r = true) {
    reachable = r;
  }

  it('should pass correct params', () => {
    service.getReachibility(vm).subscribe(r => {
      expect(http.get).toHaveBeenCalledWith('cs-extensions/http-access-helper/', {
        params: { url: address },
      });
    });
  });

  it('should handle request errors', () => {
    http.get.and.returnValue(throwError(new Error('Request error')));
    service.getReachibility(vm).subscribe(r => {
      // If request failed, we treat this as Http Address Helper being down
      expect(r).toBe(VmReachability.ServiceUnresponsive);
    });
  });

  it('should return Reachable when Helper returned { reachable: true }', () => {
    ensureReachable(true);
    service.getReachibility(vm).subscribe(r => {
      expect(r).toBe(VmReachability.Reachable);
    });
  });

  it('should return Reachable when Helper returned { reachable: false }', () => {
    ensureReachable(false);
    service.getReachibility(vm).subscribe(r => {
      expect(r).toBe(VmReachability.Unreachable);
    });
  });
});
