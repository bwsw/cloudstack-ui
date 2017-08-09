import { inject, TestBed, async, getTestBed, fakeAsync, tick } from '@angular/core/testing';
import { Injector } from '@angular/core';
import { MockBackend, MockConnection } from '@angular/http/testing';
import {
  BaseRequestOptions,
  XHRBackend,
  Http,
  HttpModule,
  Response,
  ResponseOptions,
  URLSearchParams
} from '@angular/http';
import { ServiceLocator } from './service-locator';

import { AsyncJobService } from './async-job.service';
import { CacheService } from './cache.service';
import { ErrorService } from './error.service';

import { MockCacheService } from '../../../testutils/mocks/mock-cache.service.spec';


fdescribe('Async job service', () => {
  let mockBackend: MockBackend;
  let jobQueries = 0;
  let asyncJobService: AsyncJobService;

  const mockResponse1 = {
    status: 200,
    body: {
      'listasyncjobsresponse': {
        'asyncjobs': [
          {
            'jobid': 'resolvable-job-id',
            'jobstatus': 0,
            'jobresultcode': 0
          }
        ]
      }
    }
  };

  const mockResponse2 = {
    status: 200,
    body: {
      'listasyncjobsresponse': {
        'asyncjobs': [
          {
            'jobid': 'resolvable-job-id',
            'jobstatus': 1,
            'jobresultcode': 0,
            'jobresult': {}
          }
        ]
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

        if (jobQueries <= 2) {
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
    asyncJobService.queryJob({ jobid: 'resolving-job-id' })
      .subscribe(() => expect(true).toBeTruthy());
    tick(3000);
  }));

  it('should parse failed job correctly', fakeAsync(() => {
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
    tick(3000);
  }));
});
