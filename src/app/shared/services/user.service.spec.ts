import { Component, Injectable, Injector } from '@angular/core';
import {
  async,
  discardPeriodicTasks,
  fakeAsync,
  getTestBed,
  TestBed,
  tick
} from '@angular/core/testing';
import { BaseRequestOptions, Http, HttpModule, XHRBackend } from '@angular/http';
import { MockBackend } from '@angular/http/testing';
import { NavigationExtras, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { MockCacheService } from '../../../testutils/mocks/mock-cache.service.spec';
import { MockUserTagService } from '../../../testutils/mocks/tag-services/mock-user-tag.service';
import { AsyncJobService } from './async-job.service';
import { CacheService } from './cache.service';
import { ConfigService } from './config.service';
import { ErrorService } from './error.service';
import { LocalStorageService } from './local-storage.service';
import { RouterUtilsService } from './router-utils.service';
import { ServiceLocator } from './service-locator';
import { UserTagService } from './tags/user/user-tag.service';
import { UserService } from './user.service';
import { AuthService } from './auth.service';


@Component({
  selector: 'cs-test-view',
  template: '<div></div>'
})
class TestViewComponent {
}

@Injectable()
class MockErrorService {
  public send(): void {
  }
}

class Tag {
  constructor(
    public key: string,
    public value: string
  ) {
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

  public resetInMemoryStorage(): void {
    this.storage = {};
  }
}

const configStorage = {};

function getRefreshInterval(): number {
  return +configStorage['sessionRefreshInterval'] * 1000;
}

function setRefreshInterval(value: number): void {
  configStorage['sessionRefreshInterval'] = value;
}

@Injectable()
class MockConfigService {
  public get(key: string): string {
    return configStorage[key];
  }
}

@Injectable()
class MockAsyncJobService {
  public completeAllJobs(): void {
  }
}

@Injectable()
class MockRouter {
  public navigate(route: any): Promise<any> {
    return Promise.resolve(route);
  }
}

@Injectable()
class MockRouterUtilsService {
  public get locationOrigin(): string {
    return '';
  }

  public getRedirectionQueryParams(next?: string): NavigationExtras {
    return { queryParams: { next } };
  }
}

const testBedConfig = {
  declarations: [TestViewComponent],
  providers: [
    UserService,
    MockBackend,
    BaseRequestOptions,
    AuthService,
    { provide: AsyncJobService, useClass: MockAsyncJobService },
    { provide: CacheService, useClass: MockCacheService },
    { provide: ConfigService, useClass: MockConfigService },
    { provide: ErrorService, useClass: MockErrorService },
    { provide: UserTagService, useClass: MockUserTagService },
    { provide: Router, useClass: MockRouter },
    { provide: RouterUtilsService, useClass: MockRouterUtilsService },
    { provide: LocalStorageService, useClass: MockStorageService },
    {
      provide: Http,
      deps: [MockBackend, BaseRequestOptions],
      useFactory:
        (backend: XHRBackend, defaultOptions: BaseRequestOptions) => {
          return new Http(backend, defaultOptions);
        },
    },
    Injector
  ],
  imports: [
    HttpModule
  ]
};

describe('User service session', () => {
  let userService: UserService;
  let configService: ConfigService;

  beforeEach(async(() => {
    TestBed.configureTestingModule(testBedConfig);

    ServiceLocator.injector = getTestBed().get(Injector);
    userService = TestBed.get(UserService);
    configService = TestBed.get(ConfigService);
  }));

  it('should set inactivity timeout', () => {
    userService.getInactivityTimeout()
      .subscribe(timeout => expect(timeout).toBe(0));
    userService.setInactivityTimeout(1)
      .switchMap(() => userService.getInactivityTimeout())
      .subscribe(timeout => expect(timeout).toBe(1));
  });

  it('should refresh session', fakeAsync(() => {
    const refresh = spyOn(userService, 'sendRefreshRequest');
    const inactivityTimeout = 10;
    const refreshInterval = 60;

    setRefreshInterval(refreshInterval);
    userService.setInactivityTimeout(inactivityTimeout).subscribe();

    tick(getRefreshInterval() * inactivityTimeout * 60 / refreshInterval);
    expect(refresh).toHaveBeenCalledTimes(inactivityTimeout - 1);
  }));

  it('should stop refreshing if inactivity interval=0', fakeAsync(() => {
    const refresh = spyOn(userService, 'sendRefreshRequest');
    const inactivityTimeout = 10;

    userService.setInactivityTimeout(inactivityTimeout).subscribe();
    tick(getRefreshInterval());
    expect(refresh).toHaveBeenCalledTimes(1);
    userService.setInactivityTimeout(0).subscribe();
    tick(getRefreshInterval() * 10);
    expect(refresh).toHaveBeenCalledTimes(1);
  }));

  it('should extend logout delay on user input', fakeAsync(() => {
    const authService = TestBed.get(AuthService);
    const logout = spyOn(authService, 'logout').and.returnValue(Observable.of(null));
    userService.setInactivityTimeout(1).subscribe();
    tick(getRefreshInterval() - 100);
    document.dispatchEvent(new MouseEvent('mousemove', {}));
    tick(200);
    expect(logout).toHaveBeenCalledTimes(0);
    discardPeriodicTasks();
  }));
});

describe('User service session', () => {
  let userService: UserService;
  let configService: ConfigService;
  let router: Router;
  let routerUtils: RouterUtilsService;
  const refreshInterval = 1;

  beforeEach(async(() => {
    setRefreshInterval(refreshInterval);
    TestBed.configureTestingModule(testBedConfig);

    ServiceLocator.injector = getTestBed().get(Injector);
    userService = TestBed.get(UserService);
    configService = TestBed.get(ConfigService);
    router = TestBed.get(Router);
    routerUtils = TestBed.get(RouterUtilsService);
  }));

  it('should logout after session expires', fakeAsync(() => {
    const inactivityTimeout = 10;
    const logout = spyOn(router, 'navigate').and.callThrough();
    const refresh = spyOn(userService, 'sendRefreshRequest');
    userService.startInactivityCounter();
    userService.setInactivityTimeout(inactivityTimeout).subscribe();

    tick(getRefreshInterval() * (inactivityTimeout - 1) * 60 / refreshInterval);
    expect(refresh).toHaveBeenCalledTimes(540);
    expect(logout).toHaveBeenCalledTimes(0);

    tick(getRefreshInterval() * 60);
    expect(logout).toHaveBeenCalledTimes(1);
    expect(logout)
      .toHaveBeenCalledWith(['/logout'], routerUtils.getRedirectionQueryParams());
  }));
});
