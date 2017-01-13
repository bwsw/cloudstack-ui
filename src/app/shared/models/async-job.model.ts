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
  public cmd: string;

  constructor(params) {
    super(params);
    this.mapCmd();
  }

  public mapCmd(): void {
    const regex = /^org\.apache\.cloudstack\.api\.command\.user\.vm\.(\w*)VMCmd$/;
    const matches = this.cmd.match(regex);
    if (matches) {
      this.cmd = matches[1].toLowerCase();
    }
  }
}
