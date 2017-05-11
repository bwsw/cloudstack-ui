import { Injectable, Injector } from '@angular/core';
import { async, discardPeriodicTasks, fakeAsync, getTestBed, TestBed, tick } from '@angular/core/testing';
import { BaseRequestOptions, HttpModule, Response, ResponseOptions, XHRBackend } from '@angular/http';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { Observable } from 'rxjs/Observable';

import { AuthService, ErrorService, HttpService, SESSION_REFRESH_INTERVAL } from './';
import { ServiceLocator } from './service-locator';
import { StorageService } from './storage.service';
import { UserService } from './user.service';


@Injectable()
class MockErrorService {
  public send(): void {}
}

class Tag {
  constructor(
    public key: string,
    public value: string
  ) {}
}

@Injectable()
class MockUserService {
  private tags = [];

  public readTag(key: string): Observable<string> {
    const result = this.tags.find(tag => tag.key === key);
    return Observable.of(result && result.value || null);
  }

  public writeTag(key: string, value: string): Observable<void> {
    this.tags.push(new Tag(key, value));
    return Observable.of(null);
  }
}

@Injectable()
class MockStorageService {
  private storage = {};

  public write(key: string, value: string): void {
    this.storage[key] = value;
  }

  public read(key: string): string {
    return this.storage[key] || null;
  }

  public remove(key: string): void {
    delete this.storage[key];
  }
}

describe('Custom dialog', () => {
  let authService: AuthService;
  let httpService: HttpService;
  let mockBackend: MockBackend;
  const inactivityInterval = 10;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthService,
        MockBackend,
        BaseRequestOptions,
        { provide: ErrorService, useClass: MockErrorService },
        { provide: UserService, useClass: MockUserService },
        { provide: StorageService, useClass: MockStorageService },
        { provide: HttpService,
          deps: [MockBackend, BaseRequestOptions],
          useFactory:
            (backend: XHRBackend, defaultOptions: BaseRequestOptions) => {
              return new HttpService(backend, defaultOptions);
            },
        },
        Injector
      ],
      imports: [
        HttpModule
      ]
    });

    ServiceLocator.injector = getTestBed().get(Injector);
    authService = TestBed.get(AuthService);
    httpService = TestBed.get(HttpService);
    mockBackend = TestBed.get(MockBackend);

    mockBackend.connections.subscribe((connection: MockConnection) => {
      connection.mockRespond(new Response(new ResponseOptions({ status: 200 })));
    });
  }));

  it('should set inactivity timeout', () => {
    authService.getInactivityTimeout()
      .subscribe(timeout => expect(timeout).toBe(0));
    authService.setInactivityTimeout(1)
      .switchMapTo(authService.getInactivityTimeout())
      .subscribe(timeout => expect(timeout).toBe(1));
  });

  it('should refresh session', fakeAsync(() => {
    const refresh = spyOn(httpService, 'refreshSession').and.returnValue(Observable.of(null));
    authService.setInactivityTimeout(inactivityInterval).subscribe();
    tick(SESSION_REFRESH_INTERVAL * inactivityInterval);
    expect(refresh).toHaveBeenCalledTimes(inactivityInterval - 1);
  }));

  it('should logout after session expires', fakeAsync(() => {
    const logout = spyOn(authService, 'logout').and.returnValue(Observable.of(null));
    authService.setInactivityTimeout(inactivityInterval).subscribe();
    tick(SESSION_REFRESH_INTERVAL * (inactivityInterval - 1));
    expect(logout).toHaveBeenCalledTimes(0);
    tick(SESSION_REFRESH_INTERVAL);
    expect(logout).toHaveBeenCalledTimes(1);
  }));

  it('should stop refreshing if inactivity interval=0', fakeAsync(() => {
    const refresh = spyOn(httpService, 'refreshSession');
    authService.setInactivityTimeout(inactivityInterval).subscribe();
    tick(SESSION_REFRESH_INTERVAL);
    expect(refresh).toHaveBeenCalledTimes(1);
    authService.setInactivityTimeout(0).subscribe();
    tick(SESSION_REFRESH_INTERVAL * 10);
    expect(refresh).toHaveBeenCalledTimes(1);
  }));

  it('should extend delay before logging out if a request was made', fakeAsync(() => {
    const logout = spyOn(authService, 'logout').and.returnValue(Observable.of(null));
    authService.setInactivityTimeout(2).subscribe();
    tick(SESSION_REFRESH_INTERVAL);
    httpService.get('').subscribe();
    tick(SESSION_REFRESH_INTERVAL + 100);
    expect(logout).toHaveBeenCalledTimes(0);
    discardPeriodicTasks();
  }));
});
