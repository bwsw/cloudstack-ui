import { BaseModel } from './base.model';
import { FieldMapper } from '../decorators/field-mapper.decorator';


export interface IAsyncJob<T> {
  jobId: string;
  jobStatus: number;
  jobResultCode: number;
  jobResult: T;
  jobInstanceType: string;
}

@FieldMapper({
  jobid: 'jobId',
  jobstatus: 'jobStatus',
  jobresultcode: 'jobResultCode',
  jobresult: 'jobResult',
  jobinstancetype: 'jobInstanceType'
})
export class AsyncJob extends BaseModel implements IAsyncJob<any> {
  public jobId: string;
  public jobStatus: number;
  public jobResultCode: number;
  public jobResult: any;
  public jobInstanceType: string;
  public cmd: string;

  constructor(params) {
    super(params);
    this.mapCmd();
  }

  public mapCmd(): void {
    // when a command is executed, two asyncJobService are initiated
    // one has type of "Cmd", another one is "Work"
    // we need only one so we take "Cmd" and filter any others out
    const regex = /^org\.apache\.cloudstack\.api\.command\.user\.vm\.(\w*)Cmd$/;
    if (!this.cmd) {
      this.cmd = '';
    }
    const matches = this.cmd.match(regex);
    if (matches) {
      this.cmd = matches[1].toLowerCase();
      this.formatCommand();
    } else {
      this.cmd = '';
    }
  }

  private formatCommand(): void {
    let indexOfVmSubstr = this.cmd.indexOf('vm');
    if (indexOfVmSubstr !== -1) {
      this.cmd = this.cmd.substring(0, this.cmd.length - 2);
    }
  }
}
