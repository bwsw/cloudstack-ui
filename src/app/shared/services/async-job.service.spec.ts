import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import {
  async,
  discardPeriodicTasks,
  fakeAsync,
  TestBed,
  tick
} from '@angular/core/testing';

import { MockCacheService } from '../../../testutils/mocks/mock-cache.service.spec';

import { AsyncJobService } from './async-job.service';
import { CacheService } from './cache.service';
import { ErrorService } from './error.service';


describe('Async job service', () => {
  let mockBackend: HttpTestingController;
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
        ErrorService,
        { provide: CacheService, useClass: MockCacheService },
        AsyncJobService
      ],
      imports: [
        HttpClientTestingModule
      ]
    });
  }));

  it('job service polls server until a job is resolved', fakeAsync(() => {
    asyncJobService = TestBed.get(AsyncJobService);
    asyncJobService.queryJob({ jobid: 'resolving-job-id' })
      .subscribe(() => expect(true).toBeTruthy());
    tick(3000);

    mockBackend = TestBed.get(HttpTestingController);
    mockBackend.match((req) => {
      const params = req.params;
      if (
        params.get('command') === 'queryAsyncJobResult' &&
        params.get('jobid') === 'failing-job-id'
      ) {
        return queryFailedJobResponse;
      }
      if (params.get('jobid') === 'resolving-job-id') {
        if (jobQueries <= 2) {
          jobQueries++;
          return mockResponse1;
        } else {
          jobQueries = 0;
          return mockResponse2;
        }
      }
    });
    discardPeriodicTasks();
    mockBackend.verify();
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

    mockBackend = TestBed.get(HttpTestingController);
    mockBackend.match((req) => {
      const params = req.params;
      if (
        params.get('command') === 'queryAsyncJobResult' &&
        params.get('jobid') === 'failing-job-id'
      ) {
        return queryFailedJobResponse;
      }
    });
    discardPeriodicTasks();
    mockBackend.verify();
  }));

});
