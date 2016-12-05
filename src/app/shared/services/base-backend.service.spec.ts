import { inject, TestBed, async, getTestBed } from '@angular/core/testing';

import { BaseBackendService } from './base-backend.service';
import { BaseModel } from '../models/base.model';
import { BackendResource } from '../decorators/backend-resource.decorator';
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
import { AlertService } from './alert.service';

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

  class TestModel extends BaseModel {
    public id: string;
    public field1: string;
  }

  @BackendResource({
    entity: 'Test',
    entityModel: TestModel
  })
  class TestBackendService extends BaseBackendService<TestModel> {
    constructor(http: Http, alert: AlertService) {
      super(http, alert);
    }
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [
        TestBackendService,
        AlertService,
        MockBackend,
        BaseRequestOptions,
        {
          provide: Http,
          deps: [MockBackend, BaseRequestOptions],
          useFactory:
            (backend: XHRBackend, defaultOptions: BaseRequestOptions) => {
              return new Http(backend, defaultOptions);
            },
        }
      ],
      imports: [
        FormsModule,
        HttpModule
      ]
    });
    mockBackend = getTestBed().get(MockBackend);
    mockBackend.connections.subscribe((connection: MockConnection) => {
      const url = connection.request.url;
      const params = new URLSearchParams(url.substr(url.indexOf('?') + 1));

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
        }

        (mockResponse.body.listtestsresponse as any).count = 1;
        (mockResponse.body.listtestsresponse as any).test = [item];
      }

      const options = new ResponseOptions(mockResponse);
      connection.mockRespond(new Response(options));
    });
  }));

  it('should get model list', async(inject([TestBackendService], (testService) => {
    testService.getList()
      .then((res: Array<TestModel>) => {
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
      .then((res: TestModel) => {
        expect(res instanceof TestModel).toBeTruthy();
        expect(res.id).toBe(test[1].id);
        expect(res.field1).toBe(test[1].field1);
      });
  })));

  it('should throw if model was not found by id', async(inject([TestBackendService], (testService) => {
    expect(() => {
      testService.get('unknown-id');
    }).toThrow();
  })));
});

