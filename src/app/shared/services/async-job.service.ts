import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { AsyncJob } from '../models/async-job.model';
import { BaseBackendService } from './base-backend.service';
import { BackendResource } from '../decorators/backend-resource.decorator';


interface IJobObservable {
  jobStatus: number;
  observable: Subject<AsyncJob>;
}

interface IJobObservables {
  [id: string]: IJobObservable;
}

@Injectable()
@BackendResource({
  entity: 'AsyncJob',
  entityModel: AsyncJob
})
export class AsyncJobService extends BaseBackendService<AsyncJob> {
  private jobObservables: IJobObservables;
  private timerId: any;
  private pollingInterval: number;

  constructor() {
    super();
    this.pollingInterval = 2000;
    this.jobObservables = {};
  }

  public addJob(id: string): Subject<AsyncJob> {
     let observable = new Subject<AsyncJob>();
     this.jobObservables[id] = {
       jobStatus: 0,
       observable
    };
    this.startPolling();
    return observable;
  }

  private startPolling() {
    this.timerId = setInterval(() => {
      this.queryJobs();
    }, this.pollingInterval);
  }

  private stopPolling() {
    clearInterval(this.timerId);
  }

  private queryJobs(): void {
    this.getList()
      .then((result) => {
        let anyJobs = false;
        result.forEach((elem, index, array) => {
          let id = elem.jobId;
          if (elem.jobStatus === 0) {
            anyJobs = true;
          }
          if (this.jobObservables[id] && elem.jobStatus === 1) {
            this.jobObservables[id].jobStatus = 1;
            this.jobObservables[id].observable.next(elem);
            delete this.jobObservables[id];
          }
        });
        if (!anyJobs) {
          this.stopPolling();
        }
      });
  }
}
