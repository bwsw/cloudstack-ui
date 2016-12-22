import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { AsyncJob } from '../models/async-job.model';
import { BaseBackendService } from './base-backend.service';
import { BackendResource } from '../decorators/backend-resource.decorator';


interface IJobObservables {
  [id: string]: Subject<AsyncJob | void>;
}

@Injectable()
@BackendResource({
  entity: 'AsyncJob',
  entityModel: AsyncJob
})
export class AsyncJobService extends BaseBackendService<AsyncJob> {

  public pollingInterval: number;
  public poll: boolean;
  private jobObservables: IJobObservables;
  private timerId: any;

  constructor() {
    super();
    this.pollingInterval = 5000;
    this.jobObservables = {};
  }

  public addJob(id: string): Subject<AsyncJob> {
    let observable = new Subject<AsyncJob>();
    this.jobObservables[id] = observable;
    if (!this.poll) {
      this.startPolling();
    }
    return observable;
  }

  public queryJobs(): boolean {
    if (!this.poll) {
      return false;
    }
    this.getList().then(result => {
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
      return this.poll;
    });
  }

  private startPolling(): void {
    this.timerId = setInterval(() => {
      this.queryJobs();
    }, this.pollingInterval);
    this.poll = true;
  }

  private stopPolling(): void {
    clearInterval(this.timerId);
    this.poll = false;
  }
}
