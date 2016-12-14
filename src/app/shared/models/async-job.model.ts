import { BaseModel } from './base.model';
import { FieldMapper } from '../decorators/field-mapper.decorator';

@FieldMapper({
  jobid: 'jobId',
  jobstatus: 'jobStatus',
  jobresultcode: 'jobResultCode',
  jobresult: 'jobResult'
})
export class AsyncJob extends BaseModel {
  public jobId: string;
  public jobStatus: number;
  public jobResultCode: number;
  public jobResult: any;
}
