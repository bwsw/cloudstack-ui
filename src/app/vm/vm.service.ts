import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { BaseBackendService, BACKEND_API_URL } from '../shared/services';
import { BackendResource } from '../shared/decorators';
import { VirtualMachine } from './vm.model';

import { AsyncJob } from '../shared/models/async-job.model';
import { AsyncJobService } from '../shared/services/async-job.service';
import { Http, URLSearchParams } from '@angular/http';
import { MdlDialogService } from 'angular2-mdl';


@Injectable()
@BackendResource({
  entity: 'VirtualMachine',
  entityModel: VirtualMachine
})
export class VmService extends BaseBackendService<VirtualMachine> {

  constructor(
    protected http: Http,
    protected jobs: AsyncJobService,
    private dialogService: MdlDialogService
  ) {
    super();
  }

  public startVM(id: string): Observable<AsyncJob> {
    return this.command(id, 'start');
  }

  public stopVM(id: string): Observable<AsyncJob> {
    return this.command(id, 'stop');
  }

  public restartVM(id: string): Observable<AsyncJob> {
    return this.command(id, 'restart');
  }

  private command(id: string, command: string): Observable<AsyncJob> {
    const urlParams = new URLSearchParams();

    urlParams.append('command', command + 'VirtualMachine');
    urlParams.append('id', id);
    urlParams.append('response', 'json');

    return this.http.get(BACKEND_API_URL, { search: urlParams })
      .map(result => result.json())
      .map(result => result[command + 'virtualmachineresponse'].jobid)
      .switchMap(result => this.jobs.addJob(result))
      .map(result => {
        if (result.jobResultCode === 0) {
          result.jobResult = new this.entityModel(result.jobResult.virtualmachine);
        }
        return result;
      });
  }
}
