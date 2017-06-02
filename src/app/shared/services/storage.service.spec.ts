import { TestBed } from '@angular/core/testing';
import { StorageService } from './storage.service';
import { UtilsService } from './utils.service';


describe('Storage service with local storage', () => {
  let storageService: StorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        StorageService,
        UtilsService
      ]
    });

    storageService = TestBed.get(StorageService);
    localStorage.clear();
  });

  it('should write, read and remove values', () => {
    storageService.write('testKey', 'testValue');
    expect(storageService.read('testKey')).toBe('testValue');
    storageService.remove('testKey');
    expect(storageService.read('testKey')).toBeFalsy();
  });
});

describe('Storage service without local storage', () => {
  let storageService: StorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        StorageService,
        UtilsService
      ]
    });

    spyOn(localStorage, 'setItem').and.callFake(() => { throw new Error(); });
    spyOn(localStorage, 'getItem').and.callFake(() => { throw new Error(); });
    storageService = TestBed.get(StorageService);
  });

  it('should write, read and remove values', () => {
    storageService.write('testKey', 'testValue');
    expect(storageService.read('testKey')).toBe('testValue');
    storageService.remove('testKey');
    expect(storageService.read('testKey')).toBeFalsy();
  });
});
