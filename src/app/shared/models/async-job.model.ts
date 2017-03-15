import { BaseModel } from './base.model';
import { FieldMapper } from '../decorators/field-mapper.decorator';


@FieldMapper({
  jobid: 'jobId',
  jobstatus: 'jobStatus',
  jobresultcode: 'jobResultCode',
  jobresult: 'jobResult',
  jobinstancetype: 'jobInstanceType',
  jobresulttype: 'jobResultType'
})
export class AsyncJob<T> extends BaseModel {
  public jobId: string;
  public jobStatus: number;
  public jobResultCode: number;
  public jobResult: T;
  public jobInstanceType: string;
  public jobResultType: string;
  public cmd: string;

  constructor(params) {
    super(params);
    this.mapCmd();
  }

  public mapCmd(): void {
    // when a command is executed, two jobs are initiated
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
