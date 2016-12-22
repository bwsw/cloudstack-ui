import { BaseModel } from './base.model';
import { FieldMapper } from '../decorators/field-mapper.decorator';
import { VirtualMachine } from '../../vm/vm.model';


export interface AsyncVmJob {
  jobId: string;
  jobStatus: number;
  jobResultCode: number;
  jobResult: VirtualMachine;
}

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
