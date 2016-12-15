import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { AsyncJob } from '../models/async-job.model';
import { BaseBackendService } from './base-backend.service';
import { BackendResource } from '../decorators/backend-resource.decorator';


interface IJobObservables {
  [id: string]: Subject<AsyncJob>;
}

@Injectable()
@BackendResource({
  entity: 'AsyncJob',
  entityModel: AsyncJob
})
export class AsyncJobService extends BaseBackendService<AsyncJob> {

  public pollingInterval: number;
  private poll: boolean;
  private jobObservables: IJobObservables;
  private timerId: any;

  constructor() {
    super();
    this.pollingInterval = 2000;
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

  private queryJobs(): void {
    this.getList().then((result) => {
      let anyJobs = false;
      result.forEach((elem, index, array) => {
        let id = elem.jobId;
        if (elem.jobStatus === 0) {
          anyJobs = true;
        }
        if (this.jobObservables[id] && elem.jobStatus === 1) {
          this.jobObservables[id].next(elem);
          delete this.jobObservables[id];
        }
      });
      if (!anyJobs) {
        this.stopPolling();
      }
    });
  }
}
