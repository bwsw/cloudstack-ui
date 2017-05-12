import { Component, Injectable, Injector } from '@angular/core';
import { async, discardPeriodicTasks, fakeAsync, getTestBed, TestBed, tick } from '@angular/core/testing';
import { BaseRequestOptions, HttpModule, XHRBackend } from '@angular/http';
import { MockBackend } from '@angular/http/testing';
import { Observable } from 'rxjs/Observable';

import { AuthService, ErrorService, HttpService, SESSION_REFRESH_INTERVAL } from './';
import { ServiceLocator } from './service-locator';
import { StorageService } from './storage.service';
import { UserService } from './user.service';


@Component({
  selector: 'cs-test-view',
  template: '<div></div>'
})
class TestViewComponent {}

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

  public getList(): Observable<any> {
    return Observable.of(null);
  }

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
  const inactivityInterval = 10;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TestViewComponent],
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
  }));

  it('should set inactivity timeout', () => {
    authService.getInactivityTimeout()
      .subscribe(timeout => expect(timeout).toBe(0));
    authService.setInactivityTimeout(1)
      .switchMapTo(authService.getInactivityTimeout())
      .subscribe(timeout => expect(timeout).toBe(1));
  });

  it('should refresh session', fakeAsync(() => {
    const refresh = spyOn(authService, 'sendRefreshRequest');
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
    const refresh = spyOn(authService, 'sendRefreshRequest');
    authService.setInactivityTimeout(inactivityInterval).subscribe();
    tick(SESSION_REFRESH_INTERVAL);
    expect(refresh).toHaveBeenCalledTimes(1);
    authService.setInactivityTimeout(0).subscribe();
    tick(SESSION_REFRESH_INTERVAL * 10);
    expect(refresh).toHaveBeenCalledTimes(1);
  }));

  it('should extend logout delay on user input', fakeAsync(() => {
    const logout = spyOn(authService, 'logout').and.returnValue(Observable.of(null));
    authService.setInactivityTimeout(1).subscribe();
    tick(SESSION_REFRESH_INTERVAL - 100);
    document.dispatchEvent(new MouseEvent('mousemove', {}));
    tick(200);
    expect(logout).toHaveBeenCalledTimes(0);
    discardPeriodicTasks();
  }));
});
