import { TestBed } from '@angular/core/testing';
import { StorageService } from './storage.service';
import { UtilsService } from './utils.service';


describe('Storage service with local storage', () => {
  let storageService: any;

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
    const write = spyOn(storageService, 'localStorageWrite').and.callThrough();
    const read = spyOn(storageService, 'localStorageRead').and.callThrough();
    const remove = spyOn(storageService, 'localStorageRemove').and.callThrough();

    storageService.write('testKey', 'testValue');
    expect(storageService.read('testKey')).toBe('testValue');
    storageService.remove('testKey');
    expect(storageService.read('testKey')).toBeFalsy();

    expect(write).toHaveBeenCalledWith('testKey', 'testValue');
    expect(read).toHaveBeenCalledWith('testKey');
    expect(read).toHaveBeenCalledTimes(2);
    expect(remove).toHaveBeenCalledWith('testKey');
  });
});

describe('Storage service without local storage', () => {
  let storageService: any;

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
    const write = spyOn(storageService, 'inMemoryWrite').and.callThrough();
    const read = spyOn(storageService, 'inMemoryRead').and.callThrough();
    const remove = spyOn(storageService, 'inMemoryRemove').and.callThrough();

    storageService.write('testKey', 'testValue');
    expect(storageService.read('testKey')).toBe('testValue');
    storageService.remove('testKey');
    expect(storageService.read('testKey')).toBeFalsy();

    expect(write).toHaveBeenCalledWith('testKey', 'testValue');
    expect(read).toHaveBeenCalledWith('testKey');
    expect(read).toHaveBeenCalledTimes(2);
    expect(remove).toHaveBeenCalledWith('testKey');
  });
});
