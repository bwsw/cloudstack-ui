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
import {
  AsyncJobService,
  ErrorService,
} from './';


describe('Async job service', () => {
  let mockBackend: MockBackend;
  let jobQueries = 0;
  let asyncJobService: AsyncJobService;

  const mockResponse1 = {
    status: 200,
    body: {
      'listasyncjobsresponse': {
        'asyncjobs': [
          {
            'jobid': '123',
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
            'jobid': '123',
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
        jobid: '06d1c912-1273-404f-96d9-7a89ccef4d51',
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
      if (params.has('command') && params.get('command') === 'queryAsyncJobResult') {
        connection.mockRespond(new Response(new ResponseOptions(queryFailedJobResponse)));
        return;
      }

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
    });
  }));

  beforeEach(async(inject([AsyncJobService], (service: AsyncJobService) => {
    asyncJobService = service;
  })));

  it('job service polls server until a job is resolved', fakeAsync(() => {
    let job;
    asyncJobService.addJob('123').subscribe(result => {
      job = result;
    });
    tick(1000);
    expect(job).toBeFalsy();
    expect(asyncJobService.queryJobs()).toBeTruthy();
    tick(20000);
    expect(job).toBeTruthy();
    expect(asyncJobService.queryJobs()).toBeFalsy();
  }));

  it('should parse failed job correctly', fakeAsync(() => {
    const job = { jobid: '1' };
    asyncJobService.queryJob(job)
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

