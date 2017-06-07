import { inject, TestBed, async, getTestBed } from '@angular/core/testing';
import { Injector } from '@angular/core';

import { BaseBackendService, CacheService } from './';
import { BaseModel } from '../models';
import { BackendResource } from '../decorators';
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
import { ErrorService } from '../services';
import { ServiceLocator } from './service-locator';


describe('Base backend service', () => {
  let mockBackend: MockBackend;
  let test = [
    {
      id: 'id1',
      field1: 'rand1'
    },
    {
      id: 'id2',
      field1: 'rand2'
    },
  ];

  class MockError extends Response implements Error {
    public name: string;
    public message: string;
  }

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
        ErrorService,
        MockBackend,
        BaseRequestOptions,
        CacheService,
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
    });

    ServiceLocator.injector = getTestBed().get(Injector);

    mockBackend = getTestBed().get(MockBackend);
    mockBackend.connections.subscribe((connection: MockConnection) => {
      const url = connection.request.url;
      const params = new URLSearchParams(url.substr(url.indexOf('?') + 1));

      if (params.has('error')) {
        const response = {
          status: 431,
          body: {
            'mockerrorresponse': {
              'cserrorcode': 4350,
              'errorcode': 431,
              'errortext': `The vm with hostName test already exists in the network domain:
                cs1cloud.internal; network=Ntwk[204|Guest|6]`,
              'uuidList': []
            }
          }
        };
        const options = new ResponseOptions(response);
        connection.mockError(new MockError(options));
        return;
      }

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
          connection.mockError(new Error('Wrong arguments'));
          return;
        }

        (mockResponse.body.listtestsresponse as any).count = 1;
        (mockResponse.body.listtestsresponse as any).test = [item];
      }

      const options = new ResponseOptions(mockResponse);
      setTimeout(() => connection.mockRespond(new Response(options)), 1000);
    });
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

  it('should merge concurrent requests with identical parameters', async(inject([TestBackendService], (testService) => {
    const createConnectionSpy = spyOn(mockBackend, 'createConnection').and.callThrough();
    testService.getList({ id: 'id1' }).subscribe(
      res => expect(res).toEqual([new TestModel(test[0])])
    );
    testService.getList({ id: 'id1' }).subscribe(
      res => expect(res).toEqual([new TestModel(test[0])])
    );
    expect(createConnectionSpy).toHaveBeenCalledTimes(1);
  })));

  it('should merge concurrent requests without parameters', async(inject([TestBackendService], (testService) => {
    const createConnectionSpy = spyOn(mockBackend, 'createConnection').and.callThrough();
    testService.getList().subscribe(
      res => expect(res).toEqual([new TestModel(test[0]), new TestModel(test[1])])
    );
    testService.getList().subscribe(
      res => expect(res).toEqual([new TestModel(test[0]), new TestModel(test[1])])
    );
    expect(createConnectionSpy).toHaveBeenCalledTimes(1);
  })));

  it('should not merge concurrent requests with different parameters',
    async(inject([TestBackendService], (testService) => {
      const createConnectionSpy = spyOn(mockBackend, 'createConnection').and.callThrough();
      testService.getList({ id: 'id1' }).subscribe(
        res => expect(res).toEqual([new TestModel(test[0])])
      );
      testService.getList({ id: 'id2' }).subscribe(
        res => expect(res).toEqual([new TestModel(test[1])])
      );
      expect(createConnectionSpy).toHaveBeenCalledTimes(2);
    })));
});

