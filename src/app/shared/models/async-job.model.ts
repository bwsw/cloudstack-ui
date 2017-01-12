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

  constructor() {
    super();
    this.mapCmd();
  }

  public mapCmd(): void {
    switch (this.cmd) {
      case 'org.apache.cloudstack.api.command.user.vm.StartVMCmd':
          this.cmd = 'Start'
        break;
      case 'org.apache.cloudstack.api.command.user.vm.StopVMCmd':
          this.cmd = 'Stop'
        break;
      case 'org.apache.cloudstack.api.command.user.vm.RestartVMCmd':
          this.cmd = 'Restart'
        break;
      case 'org.apache.cloudstack.api.command.user.vm.RestoreVMCmd':
          this.cmd = 'Restore'
        break;
      case 'org.apache.cloudstack.api.command.user.vm.DestroyVMCmd':
          this.cmd = 'Destroy'
        break;
      case 'org.apache.cloudstack.api.command.user.vm.DeployVMCmd':
          this.cmd = 'Deploy'
        break;
      default: break;
    }
  }
}