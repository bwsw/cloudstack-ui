import {Injector} from '@angular/core';
import {async, inject, TestBed} from '@angular/core/testing';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {BackendResource} from '../decorators';

import {BaseModel} from '../models';
import {BaseBackendService} from './base-backend.service';
import {CacheService} from './cache.service';
import {ErrorService} from './error.service';
import {ServiceLocator} from './service-locator';
import {LocalStorageService} from './local-storage.service';


describe('Base backend service', () => {
  let mockBackend: HttpTestingController;
  const test = [
    {
      id: 'id1',
      field1: 'rand1'
    },
    {
      id: 'id2',
      field1: 'rand2'
    },
  ];

  class TestModel extends BaseModel {
    public id: string;
    public field1: string;
  }

  @BackendResource({
    entity: 'Test',
    entityModel: TestModel
  })
  class TestBackendService extends BaseBackendService<TestModel> { }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [
        TestBackendService,
        LocalStorageService,
        ErrorService,
        CacheService,
      ],
      imports: [
        HttpClientTestingModule
      ]
    });
    ServiceLocator.injector = TestBed.get(Injector);

  }));

  it('should get model list', async(inject([TestBackendService], (testService) => {
    testService.getList()
      .subscribe((res: Array<TestModel>) => {
        expect(res.length).toBe(test.length);

        res.forEach((testModel: TestModel, ind: number) => {
          expect(testModel instanceof TestModel).toBeTruthy();
          expect(testModel.id).toBe(test[ind].id);
          expect(testModel.field1).toBe(test[ind].field1);
        });
      });
  })));

  it('should get model by id', async(inject([TestBackendService], (testService) => {
    testService.get(test[1].id)
      .subscribe((res: TestModel) => {
        expect(res instanceof TestModel).toBeTruthy();
        expect(res.id).toBe(test[1].id);
        expect(res.field1).toBe(test[1].field1);
      });
  })));

  it('should throw if model was not found by id', async(inject([TestBackendService], (testService) => {
    testService.get('unknown-id').subscribe(
      () => {},
      error => expect(error).toBeDefined()
    );
  })));

  it('should parse an error', async(inject([TestBackendService], (testService) => {
    testService.sendCommand('test', { error: true })
      .subscribe(
        () => {},
        error => {
          expect(error).toBeDefined();
          expect(error.errorcode).toBeDefined();
          expect(error.errortext).toBeDefined();
          expect(error.message).toBeDefined();
        }
      );
  })));

  it('should merge concurrent requests with identical parameters', async(() => {
    let testService = TestBed.get(TestBackendService);

    testService.getList({ id: 'id1' }).subscribe(
      res => expect(res).toEqual([new TestModel(test[0])])
    );
    testService.getList({ id: 'id1' }).subscribe(
      res => expect(res).toEqual([new TestModel(test[0])])
    );

    mockBackend = TestBed.get(HttpTestingController);
    mockBackend.expectOne((req) => {
      const params = req.params;
      const mockResponse = {
        status: 200,
        body: {
          'listtestsresponse': {}
        }
      };
      if (!params.has('id')) {
        (mockResponse.body.listtestsresponse as any).count = test.length;
        (mockResponse.body.listtestsresponse as any).test = test;
      } else {
        const id = params.get('id');

        const item = test.find(m => m.id === id);

        if (item === undefined) {
          return new Error('Wrong arguments');
        }

        (mockResponse.body.listtestsresponse as any).count = 1;
        (mockResponse.body.listtestsresponse as any).test = [item];
      }
      return mockResponse;
    });
  }));

  it('should merge concurrent requests without parameters', async(() => {
    let testService = TestBed.get(TestBackendService);
    testService.getList().subscribe(
      res => expect(res).toEqual([new TestModel(test[0]), new TestModel(test[1])])
    );
    testService.getList().subscribe(
      res => expect(res).toEqual([new TestModel(test[0]), new TestModel(test[1])])
    );
    mockBackend = TestBed.get(HttpTestingController);
    mockBackend.expectOne((req) => {
      const params = req.params;
      const mockResponse = {
        status: 200,
        body: {
          'listtestsresponse': {}
        }
      };
      if (!params.has('id')) {
        (mockResponse.body.listtestsresponse as any).count = test.length;
        (mockResponse.body.listtestsresponse as any).test = test;
      } else {
        const id = params.get('id');

        const item = test.find(m => m.id === id);

        if (item === undefined) {
          return new Error('Wrong arguments');
        }

        (mockResponse.body.listtestsresponse as any).count = 1;
        (mockResponse.body.listtestsresponse as any).test = [item];
      }
      return mockResponse;
    });
  }));

  it('should not merge concurrent requests with different parameters', async(() => {
    let testService = TestBed.get(TestBackendService);
      testService.getList({ id: 'id1' }).subscribe(
        res => expect(res).toEqual([new TestModel(test[0])])
      );
      testService.getList({ id: 'id2' }).subscribe(
        res => expect(res).toEqual([new TestModel(test[1])])
      );
      mockBackend = TestBed.get(HttpTestingController);
      mockBackend.match((req) => {
        const params = req.params;
        const mockResponse = {
          status: 200,
          body: {
            'listtestsresponse': {}
          }
        };
        if (!params.has('id')) {
          (mockResponse.body.listtestsresponse as any).count = test.length;
          (mockResponse.body.listtestsresponse as any).test = test;
        } else {
          const id = params.get('id');

          const item = test.find(m => m.id === id);

          if (item === undefined) {
            return new Error('Wrong arguments');
          }

          (mockResponse.body.listtestsresponse as any).count = 1;
          (mockResponse.body.listtestsresponse as any).test = [item];
        }
        return mockResponse;
      });
    }));
});

