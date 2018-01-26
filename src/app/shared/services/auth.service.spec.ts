import {
  async,
  fakeAsync,
  inject,
  TestBed,
  tick
} from '@angular/core/testing';
import { LocalStorageService } from './local-storage.service';
import { Observable } from 'rxjs/Observable';
import { AsyncJobService } from './async-job.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { JobsNotificationService } from './jobs-notification.service';
import { HttpClient } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { Injectable } from '@angular/core';

class MockStore<T> {
}

@Injectable()
class MockStorageService {
  private storage: any = {
    user: {
      userid: '1'
    }
  };

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

describe('Auth service', () => {
  let storageService: LocalStorageService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthService,
        AsyncJobService,
        HttpClient,
        JobsNotificationService,
        {provide: LocalStorageService, useClass: MockStorageService},
        {provide: Store, useClass: MockStore}
      ],
      imports: [
        HttpClientTestingModule
      ]
    });

    storageService = TestBed.get(LocalStorageService);
  }));

  it('should login', fakeAsync(inject([AuthService], (testService) => {
    const params = {
      'username': 'username',
      'password': 'password',
      'domain': 'domain'
    };

    const spyPostRequest = spyOn(testService, 'postRequest').and.callFake(() => {
      return Observable.of(params);
    });

    const spyGetResponse = spyOn(testService, 'getResponse').and.callFake(() => {
      return Observable.of(params);
    });

    testService.login('username', 'password', 'domain').subscribe();

    tick(3000);

    expect(spyPostRequest).toHaveBeenCalled();
    expect(spyPostRequest).toHaveBeenCalledWith('login', params);
    expect(spyGetResponse).toHaveBeenCalled();
  })));

  it('should logout', fakeAsync(inject([AuthService, LocalStorageService], (testService, testStorage) => {
    const spySend = spyOn(testService, 'postRequest').and.callFake(() => {
      return Observable.of({});
    });

    testService.logout();

    expect(spySend).toHaveBeenCalled();
    expect(spySend).toHaveBeenCalledWith('logout');
  })));

  it('should call getCapabilities if user is define', fakeAsync(
    inject(
    [AuthService, LocalStorageService],
    (testService, testStorage) => {
    const spySendCommand = spyOn(testService, 'sendCommand').and.callFake(() => {
      return Observable.of({})
    });

    const user = {userid: '1'};

    testStorage.write('user', JSON.stringify(user));
    testService.initUser();

    expect(spySendCommand).toHaveBeenCalled();
    expect(spySendCommand).toHaveBeenCalledWith('listCapabilities', {}, '');
    expect(testService._user).toEqual(user);
  })));

  it('should return Promise if user is undefine', async(inject([AuthService], (testService) => {
    expect(testService.initUser()).toEqual(Promise.resolve());
  })));
});
