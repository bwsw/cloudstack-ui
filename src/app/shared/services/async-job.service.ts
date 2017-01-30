import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs/Rx';

import { AsyncJob } from '../models/async-job.model';
import { BaseBackendService } from './base-backend.service';
import { BackendResource } from '../decorators/backend-resource.decorator';
import { AuthService } from './auth.service';


interface IJobObservables {
  [id: string]: Subject<AsyncJob | void>;
}

@Injectable()
@BackendResource({
  entity: 'AsyncJob',
  entityModel: AsyncJob
})
export class AsyncJobService extends BaseBackendService<AsyncJob> {
  public event: Subject<AsyncJob>;
  public pollingInterval: number;
  public immediatePollingInterval: number;
  public poll: boolean;
  private jobObservables: IJobObservables;
  private timerId: any;

  constructor(
    private authService: AuthService
  ) {
    super();
    this.pollingInterval = 2000;
    this.immediatePollingInterval = 100;
    this.jobObservables = {};
    this.event = new Subject<AsyncJob>();
    this.authService.loggedIn.subscribe(loggedIn => {
      if (!loggedIn) {
        this.stopPolling();
        this.jobObservables = {};
      }
    });
  }

  public addJob(id: string): Observable<AsyncJob> {
    let observable = new Subject<AsyncJob>();
    this.jobObservables[id] = observable;
    this.startPolling();
    return observable;
  }

  public queryJobs(): boolean {
    if (!this.poll) {
      return false;
    }
    this.getList().subscribe(result => {
      let anyJobs = false;
      result.forEach(elem => {
        let id = elem.jobId;
        if (this.jobObservables[id]) {
          if (elem.jobStatus === 0) { // if the job is completed successfully
            anyJobs = true;
          } else {
            this.jobObservables[id].next(elem);
            delete this.jobObservables[id];
          }
        }
      });
      if (!anyJobs) {
        this.stopPolling();
      }
    });
    return true;
  }

  private startPolling(): void {
    clearInterval(this.timerId);
    setTimeout(() => {
      this.queryJobs();
      this.timerId = setInterval(() => this.queryJobs(), this.pollingInterval);
    }, this.immediatePollingInterval);
    this.poll = true;
  }

  private stopPolling(): void {
    clearInterval(this.timerId);
    this.poll = false;
  }
}
