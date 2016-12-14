import { inject, TestBed, async, getTestBed } from '@angular/core/testing';
import { Injector } from '@angular/core';
import { MockBackend, MockConnection } from '@angular/http/testing';
import {
  Http,
  BaseRequestOptions,
  XHRBackend,
  HttpModule,
  Response,
  ResponseOptions,
  URLSearchParams
} from '@angular/http';
import { FormsModule } from '@angular/forms';
import { MockNotificationService } from '../notification.service';
import { ServiceLocator } from './service-locator';
import { AsyncJobService } from './async-job.service';
import { AsyncQueryService } from './async-query.service';

console.log(AsyncJobService);

describe('Async job service', () => {
  let mockBackend: MockBackend;
  let jobQueries = 0;
  let asyncJobService: AsyncJobService;

  const mockResponsePending = {
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

  const mockResponseDone = {
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

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [
        AsyncJobService,
        AsyncQueryService,
        { provide: 'INotificationService', useClass: MockNotificationService },
        MockBackend,
        BaseRequestOptions,
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
        FormsModule,
        HttpModule
      ]
    });

    ServiceLocator.injector = getTestBed().get(Injector);

    mockBackend = getTestBed().get(MockBackend);
    mockBackend.connections.subscribe((connection: MockConnection) => {
      const url = connection.request.url;
      const params = new URLSearchParams(url.substr(url.indexOf('?') + 1));

      let options: ResponseOptions;

      if (jobQueries <= 2) {
        options = new ResponseOptions(mockResponsePending);
        jobQueries++;
        connection.mockRespond(new Response(options));
        return;
      } else if (jobQueries > 2) {
        options = new ResponseOptions(mockResponseDone);
        jobQueries = 0;
        connection.mockRespond(new Response(options));
        return;
      }
    });
  }));

  beforeEach(async(inject([AsyncJobService], (service: AsyncJobService) => {
    asyncJobService = service;
  })));

  it('job service polls server until a job is resolved', done => {
    console.log(asyncJobService);
    asyncJobService.addJob('123').subscribe(result => {
      expect(result.jobStatus).toBe(1);
      done();
    });
  }, 20000);
});

