import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Http, URLSearchParams } from '@angular/http';
import { AsyncJobService } from '../services/async-job.service';
import { AsyncJob } from '../models/async-job.model';
import { BACKEND_API_URL } from './base-backend.service';


interface IStartVmResponse {
  startvirtualmachineresponse: {
    jobid: string;
  };
}

interface IStopVmResponse {
  stopvirtualmachineresponse: {
    jobid: string;
  };
}

@Injectable()
export class AsyncQueryService {
  constructor(
    private http: Http,
    private jobs: AsyncJobService
  ) {}

  public startVm(id: string): Observable<AsyncJob> {
    const urlParams = new URLSearchParams();

    urlParams.append('command', 'startVirtualMachine');
    urlParams.append('id', id);
    urlParams.append('response', 'json');

    return this.http.get(BACKEND_API_URL, { search: urlParams })
      .map(result => result.json())
      .map((result: IStartVmResponse) => result.startvirtualmachineresponse.jobid)
      .switchMap(result => this.jobs.addJob(result));
  }

  public stopVm(id: string): Observable<AsyncJob> {
    const urlParams = new URLSearchParams();
    urlParams.append('command', 'stopVirtualMachine');
    urlParams.append('id', id);
    urlParams.append('response', 'json');

    return this.http.get(BACKEND_API_URL, { search: urlParams })
      .map(result => result.json())
      .map((result: IStopVmResponse) => result.stopvirtualmachineresponse.jobid)
      .switchMap(result => this.jobs.addJob(result));
  }
}
