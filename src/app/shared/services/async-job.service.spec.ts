import { Injector } from '@angular/core';
import { async, fakeAsync, getTestBed, inject, TestBed } from '@angular/core/testing';
import {
  BaseRequestOptions,
  Http,
  HttpModule,
  Response,
  ResponseOptions,
  URLSearchParams,
  XHRBackend
} from '@angular/http';
import { MockBackend, MockConnection } from '@angular/http/testing';

import { MockCacheService } from '../../../testutils/mocks/mock-cache.service.mock';

import { AsyncJobService } from './async-job.service';
import { CacheService } from './cache.service';
import { ErrorService } from './error.service';
import { ServiceLocator } from './service-locator';


describe('Async job service', () => {
  let mockBackend: MockBackend;
  let jobQueries = 0;
  let asyncJobService: AsyncJobService;

  const mockResponse1 = {
    status: 200,
    body: {
      'queryasyncjobresultresponse': {
        'jobid': 'resolvable-job-id',
        'jobstatus': 0,
        'jobresultcode': 0
      }
    }
  };

  const mockResponse2 = {
    status: 200,
    body: {
      'queryasyncjobresultresponse': {
        'jobid': 'resolvable-job-id',
        'jobstatus': 1,
        'jobresultcode': 0,
        'jobresult': {}
      }
    }
  };

  const queryFailedJobResponse = {
    status: 200,
    body: {
      queryasyncjobresultresponse: {
        jobid: 'failing-job-id',
        jobresult: {
          errorcode: 530,
          errortext: 'Failed to authorize security group ingress rule(s)'
        },
        jobresultcode: 530,
        jobstatus: 2,
      }
    }
  };

  beforeEach(async(() => {
    jobQueries = 0;
    TestBed.configureTestingModule({
      providers: [
        AsyncJobService,
        ErrorService,
        MockBackend,
        BaseRequestOptions,
        { provide: CacheService, useClass: MockCacheService },
        {
          provide: Http,
          deps: [MockBackend, BaseRequestOptions],
          useFactory: (backend: XHRBackend, defaultOptions: BaseRequestOptions) => {
            return new Http(backend, defaultOptions);
          },
        },
        Injector
      ],
      imports: [
        HttpModule
      ]
    });

    ServiceLocator.injector = getTestBed().get(Injector);

    mockBackend = getTestBed().get(MockBackend);
    mockBackend.connections.subscribe((connection: MockConnection) => {
      const url = connection.request.url;
      const params = new URLSearchParams(url.substr(url.indexOf('?') + 1));
      if (
        params.get('command') === 'queryAsyncJobResult' &&
        params.get('jobid') === 'failing-job-id'
      ) {
        connection.mockRespond(new Response(new ResponseOptions(queryFailedJobResponse)));
        return;
      }

      if (params.get('jobid') === 'resolving-job-id') {
        let options: ResponseOptions;

        if (jobQueries < 2) {
          options = new ResponseOptions(mockResponse1);
          jobQueries++;
          connection.mockRespond(new Response(options));
          return;
        } else {
          options = new ResponseOptions(mockResponse2);
          jobQueries = 0;
          connection.mockRespond(new Response(options));
          return;
        }
      }

      throw new Error('Incorrect API request');
    });
  }));

  beforeEach(async(inject([AsyncJobService], (service: AsyncJobService) => {
    asyncJobService = service;
  })));

  it('job service polls server until a job is resolved', fakeAsync(() => {
    jest.useFakeTimers();
    asyncJobService.queryJob({ jobid: 'resolving-job-id' })
      .subscribe(() => {
        expect(true).toBeTruthy();
      });
    jest.runTimersToTime(6000);
    expect.assertions(1);
    jest.useRealTimers();
  }));

  it('should parse failed job correctly', fakeAsync(() => {
    jest.useFakeTimers();
    asyncJobService.queryJob({ jobid: 'failing-job-id' })
      .subscribe(
        () => {},
        (error) => {
          expect(error).toBeDefined();
          expect(error.errorcode).toBeDefined();
          expect(error.errortext).toBeDefined();
          expect(error.message).toBeDefined();
        }
      );
    jest.runTimersToTime(3000);
    jest.useRealTimers();
    expect.assertions(4);
  }));
});
