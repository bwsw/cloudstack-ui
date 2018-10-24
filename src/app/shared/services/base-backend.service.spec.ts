import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { async, inject, TestBed } from '@angular/core/testing';
import { BackendResource } from '../decorators';

import { BaseModel } from '../models';
import { BaseBackendService } from './base-backend.service';
import { CacheService } from './cache.service';
import { HttpClient } from '@angular/common/http';

describe('Base backend service', () => {
  let mockBackend: HttpTestingController;
  const test = [
    {
      id: 'id1',
      field1: 'rand1',
    },
    {
      id: 'id2',
      field1: 'rand2',
    },
  ];

  interface TestModel extends BaseModel {
    id: string;
    field1: string;
  }

  @BackendResource({
    entity: 'Test',
  })
  class TestBackendService extends BaseBackendService<TestModel> {
    constructor(http: HttpClient) {
      super(http);
    }
  }

  beforeEach(async(() => {
    CacheService.invalidateAll();
    TestBed.configureTestingModule({
      providers: [TestBackendService],
      imports: [HttpClientTestingModule],
    });
  }));

  it('should create model list', async(
    inject([TestBackendService], testService => {
      testService.getList().subscribe((res: TestModel[]) => {
        expect(res.length).toBe(test.length);

        res.forEach((testModel: TestModel, ind: number) => {
          expect(testModel.id).toBe(test[ind].id);
          expect(testModel.field1).toBe(test[ind].field1);
        });
      });
    }),
  ));

  it('should create model by id', async(
    inject([TestBackendService], testService => {
      testService.get(test[1].id).subscribe((res: TestModel) => {
        expect(res.id).toBe(test[1].id);
        expect(res.field1).toBe(test[1].field1);
      });
    }),
  ));

  it('should throw if model was not found by id', async(
    inject([TestBackendService], testService => {
      testService.get('unknown-id').subscribe(() => {}, error => expect(error).toBeDefined());
    }),
  ));

  it('should parse an error', async(
    inject([TestBackendService], testService => {
      testService.sendCommand('test', { error: true }).subscribe(
        () => {},
        error => {
          expect(error).toBeDefined();
          expect(error.errorcode).toBeDefined();
          expect(error.errortext).toBeDefined();
          expect(error.message).toBeDefined();
        },
      );
    }),
  ));

  it('should merge concurrent requests with identical parameters', async(() => {
    const testService = TestBed.get(TestBackendService);
    const testData = test[0];

    testService
      .getList({ id: testData.id })
      .subscribe(res => expect(res).toEqual([testData as TestModel]));
    testService
      .getList({ id: testData.id })
      .subscribe(res => expect(res).toEqual([testData as TestModel]));

    mockBackend = TestBed.get(HttpTestingController);
    const response = mockBackend.expectOne({});

    const mockResponse = {
      listtestsresponse: {
        count: 1,
        test: [testData],
      },
    };

    response.flush(mockResponse);
  }));

  it('should merge concurrent requests without parameters', async(() => {
    const testService = TestBed.get(TestBackendService);
    testService
      .getList()
      .subscribe(res => expect(res).toEqual([test[0] as TestModel, test[1] as TestModel]));
    testService
      .getList()
      .subscribe(res => expect(res).toEqual([test[0] as TestModel, test[1] as TestModel]));

    const mockResponse = {
      listtestsresponse: {
        test,
        count: test.length,
      },
    };

    const httpTestingController: HttpTestingController = TestBed.get(HttpTestingController);
    const response = httpTestingController.expectOne({});
    response.flush(mockResponse);
  }));

  it('should not merge concurrent requests with different parameters', async(() => {
    const testService = TestBed.get(TestBackendService);
    testService
      .getList({ id: 'id1' })
      .subscribe(res => expect(res).toEqual([test[0] as TestModel]));
    testService
      .getList({ id: 'id2' })
      .subscribe(res => expect(res).toEqual([test[1] as TestModel]));
    mockBackend = TestBed.get(HttpTestingController);
    const requests = mockBackend.match({});

    const mockResponse1 = {
      listtestsresponse: {
        count: test.length,
        test: [test[0]],
      },
    };

    const mockResponse2 = {
      listtestsresponse: {
        count: test.length,
        test: [test[1]],
      },
    };

    expect(requests.length).toBe(2);
    requests[0].flush(mockResponse1);
    requests[1].flush(mockResponse2);
  }));
});
