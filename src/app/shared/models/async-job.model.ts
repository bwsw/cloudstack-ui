import { BaseModel } from './base.model';
import { FieldMapper } from '../decorators/field-mapper.decorator';


export interface IAsyncJob<T> {
  jobId: string;
  jobStatus: number;
  jobResultCode: number;
  jobResult: T;
}

@FieldMapper({
  jobid: 'jobId',
  jobstatus: 'jobStatus',
  jobresultcode: 'jobResultCode',
  jobresult: 'jobResult'
})
export class AsyncJob extends BaseModel implements IAsyncJob<any> {
  public jobId: string;
  public jobStatus: number;
  public jobResultCode: number;
  public jobResult: any;
}
