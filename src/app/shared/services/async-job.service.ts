import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs/Rx';

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
  public event: Subject<AsyncJob>;
  public pollingInterval: number;
  public immediatePollingInterval: number;
  public poll: boolean;
  private jobObservables: IJobObservables;
  private timerId: any;

  constructor() {
    super();
    this.pollingInterval = 2000;
    this.immediatePollingInterval = 100;
    this.jobObservables = {};
    this.event = new Subject<AsyncJob>();
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
            this.jobObservables[id].complete();
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

  public register(job: any, entity: string, entityModel: any): Observable<any> {
    let jobId = job.jobId || job.jobid || job;
    if (typeof jobId !== 'string') {
      throw new Error('Unsupported job format');
    }
    return this.addJob(job)
      .map(result => {
        let entityResponse = result.jobResult[entity.toLowerCase()];

        if (result && result.jobResultCode === 0 && entityResponse) {
          result.jobResult = this.prepareModel(result.jobResult[entity.toLowerCase()], entityModel);
        }

        if (result.jobStatus === 2) {
          return Observable.throw(result);
        }

        this.event.next(result);
        return result;
      });
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
