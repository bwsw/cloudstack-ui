import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs/Rx';

import { AsyncJob } from '../models/async-job.model';
import { BaseBackendService } from './base-backend.service';
import { BackendResource } from '../decorators/backend-resource.decorator';


interface IJobObservables {
  [id: string]: Subject<AsyncJob<any> | void>;
}

const enum JobStatus {
  InProgress,
  Completed,
  Failed
}

@Injectable()
@BackendResource({
  entity: 'AsyncJob',
  entityModel: AsyncJob
})
export class AsyncJobService extends BaseBackendService<AsyncJob<any>> {
  public event: Subject<AsyncJob<any>>;
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
    this.event = new Subject<AsyncJob<any>>();
  }

  public addJob(id: string): Observable<AsyncJob<any>> {
    let observable = new Subject<AsyncJob<any>>();
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
        let id = elem.id;
        if (this.jobObservables[id]) {
          if (elem.status === 0) { // if the job is completed successfully
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

  public register(job: any, entity = '', entityModel: any = null): Observable<any> {
    let jobId = this.getJobId(job);
    return this.addJob(jobId)
      .map(result => {
        let entityResponse = result.result[entity.toLowerCase()];

        if (result && result.resultCode === 0 && entityResponse) {
          result.result = this.prepareModel(result.result[entity.toLowerCase()], entityModel);
        }

        if (result.status === 2) {
          return Observable.throw(result);
        }

        this.event.next(result);
        return result;
      });
  }

  public queryJob(job: any, entity = '', entityModel: any = null): Observable<typeof entityModel> {
    const jobId = this.getJobId(job);
    let obs = new Subject<AsyncJob<typeof entityModel>>();

    let interval = setInterval(() => {
      this.sendCommand('query;Result', { jobId })
        .map(res => new AsyncJob<typeof entityModel>(res))
        .subscribe((asyncJob) => {
          switch (asyncJob.status) {
            case JobStatus.InProgress: return;
            case JobStatus.Completed: {
              obs.next(this.getResult(asyncJob, entity, entityModel));
            } break;
            case JobStatus.Failed: {
              obs.error(asyncJob.result);
              break;
            }
          }

          clearInterval(interval);
          obs.complete();
          this.event.next(asyncJob);
        });
    }, this.pollingInterval);
    return obs;
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

  private getJobId(job: any): string {
    const jobId = job.id || job.jobid || job;
    if (typeof jobId !== 'string') {
      throw new Error('Unsupported job format');
    }
    return jobId;
  }

  private getResult(
    asyncJob: AsyncJob<typeof entityModel>,
    entity = '',
    entityModel: any = null
  ): any {
    // when response is just success: true/false
    if (asyncJob.result && asyncJob.result.success) {
      return asyncJob.result;
    }

    const hasEntity = asyncJob.instanceType || asyncJob.resultType;
    let result;
    if (hasEntity) {
      result = this.prepareModel(asyncJob.result[entity.toLowerCase()], entityModel);
      asyncJob.result = result;
    } else {
      result = asyncJob;
    }
    return result;
  }
}
