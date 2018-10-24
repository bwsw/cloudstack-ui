import 'reflect-metadata';
import { AsyncJob, mapCmd } from './async-job.model';

describe('AsyncJob model', () => {
  class TestModel {
    public id: string;
    public field1: string;
  }

  const testModel = { id: '1', field1: '1' } as TestModel;

  const asyncTestModel = {
    jobid: '1',
    jobstatus: 1,
    jobresult: testModel,
    jobresulttype: '',
    jobresultcode: 3,
    jobinstancetype: '',
  } as AsyncJob<TestModel>;

  it('should return result if cmd is undefined', () => {
    const testEmptyModel = {} as AsyncJob<TestModel>;

    expect(mapCmd(testEmptyModel)).toEqual('');
  });

  it('should return result if cmd match to regex', () => {
    asyncTestModel.cmd = 'org.apache.cloudstack.api.command.any.vm.anyCmd';

    expect(mapCmd(asyncTestModel)).toEqual('org.apache.cloudstack.api.command.any.vm.anyC');
  });

  it('should return result if cmd doesn`t match to regex', () => {
    asyncTestModel.cmd = 'any';

    expect(mapCmd(asyncTestModel)).toEqual('');
  });
});
