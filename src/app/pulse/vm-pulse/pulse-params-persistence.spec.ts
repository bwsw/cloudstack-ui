import { TestBed } from '@angular/core/testing';
import { AuthService } from '../../shared/services/auth.service';
import { MemoryStorageService } from '../../shared/services/memory-storage.service';
import { StorageService } from '../../shared/services/storage.service';
import { pulseParamsKey, PulseParamsPersistence } from './pulse-params-persistence';

describe('PulseParamsPersistence', () => {
  let persistence: PulseParamsPersistence;

  let storage: StorageService;
  let auth;

  const userId = 'test';

  beforeEach(() => {
    auth = {
      user: { userid: userId },
    };

    TestBed.configureTestingModule({
      providers: [
        PulseParamsPersistence,
        {
          provide: StorageService,
          useClass: MemoryStorageService,
        },
        {
          provide: AuthService,
          useFactory: () => auth,
        },
      ],
    }).compileComponents();

    persistence = TestBed.get(PulseParamsPersistence);

    storage = TestBed.get(StorageService);
  });

  it('should fallback to an empty params object', () => {
    // storage is empty at this point
    expect(persistence.readParams()).toEqual({
      aggregations: undefined,
      scaleRange: undefined,
      shift: undefined,
      shiftAmount: undefined,
    });
  });

  it('should write params', () => {
    expect(storage.read(pulseParamsKey)).toBeFalsy();

    const params = { shiftAmount: 5 };
    persistence.writeParams(params);
    expect(storage.read(pulseParamsKey)).toBe(
      JSON.stringify({
        [userId]: params,
      }),
    );
    expect(persistence.readParams()).toEqual({
      ...params,
      aggregations: undefined,
      scaleRange: undefined,
      shift: undefined,
    });
  });

  it('should store params by user id', () => {
    function setUserId(id: string) {
      auth.user.userid = id;
    }

    persistence.writeParams({ shiftAmount: 1 });

    setUserId('another user');
    persistence.writeParams({ shiftAmount: 2 });

    setUserId(userId);
    expect(persistence.readParams().shiftAmount).toBe(1);
    setUserId('another user');
    expect(persistence.readParams().shiftAmount).toBe(2);
  });
});
