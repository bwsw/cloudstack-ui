import { TestBed } from '@angular/core/testing';
import { LocalStorageService } from './local-storage.service';
import { SessionStorageService } from './session-storage.service';
import { MemoryStorageService } from './memory-storage.service';

describe('Storage creation-services (Local Storage)', () => {
  let localStorageService: LocalStorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LocalStorageService],
    });

    localStorageService = TestBed.get(LocalStorageService);
    localStorage.clear();
  });

  it('should write, read and remove values', () => {
    localStorageService.write('testKey', 'testValue');
    expect(localStorageService.read('testKey')).toBe('testValue');
    localStorageService.remove('testKey');
    expect(localStorageService.read('testKey')).toBeFalsy();
  });
});

describe('Storage services (Session Storage)', () => {
  let sessionStorageService: SessionStorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SessionStorageService],
    });

    sessionStorageService = TestBed.get(SessionStorageService);
    sessionStorage.clear();
  });

  it('should write, read and remove values', () => {
    sessionStorageService.write('testKey', 'testValue');
    expect(sessionStorageService.read('testKey')).toBe('testValue');
    sessionStorageService.remove('testKey');
    expect(sessionStorageService.read('testKey')).toBeFalsy();
  });
});

describe('Storage services (Memory Storage)', () => {
  let memoryStorageService: MemoryStorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MemoryStorageService],
    });

    memoryStorageService = TestBed.get(MemoryStorageService);
    memoryStorageService.reset();
  });

  it('should write, read and remove values', () => {
    memoryStorageService.write('testKey', 'testValue');
    expect(memoryStorageService.read('testKey')).toBe('testValue');
    memoryStorageService.remove('testKey');
    expect(memoryStorageService.read('testKey')).toBeFalsy();
  });
});
