import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import { AsyncJob } from '../models';
import { BaseBackendService } from './base-backend.service';
import { BackendResource } from '../decorators';
import { ErrorService } from './error.service';
import { AuthService } from './';


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
  private jobs: Array<Subject<AsyncJob<any>>> = [];

  constructor(private authService: AuthService) {
    super();
    this.pollingInterval = 2000;
    this.immediatePollingInterval = 100;
    this.event = new Subject<AsyncJob<any>>();
    this.authService.loggedIn.subscribe(() => {
      this.completeAllJobs();
    });
  }

  public queryJob(job: any, entity = '', entityModel: any = null): Observable<typeof entityModel> {
    const jobId = this.getJobId(job);
    const jobSubject = new Subject<AsyncJob<typeof entityModel>>();
    this.jobs.push(jobSubject);

    setTimeout(() => {
      this._queryJob(jobId, jobSubject, entity, entityModel);
      let interval = setInterval(() => {
        if (jobSubject.isStopped) {
          clearInterval(interval);
          return;
        }
        this._queryJob(jobId, jobSubject, entity, entityModel, interval);
      }, this.pollingInterval);
    }, this.immediatePollingInterval);
    return jobSubject;
  }

  private completeAllJobs(): void {
    this.jobs.forEach(job => job.complete());
  }

  private _queryJob(
    jobId: string,
    jobSubject: Subject<AsyncJob<any>>,
    entity: string,
    entityModel: any,
    interval?: any
  ): void {
    this.sendCommand('query;Result', { jobId })
      .map(res => new AsyncJob<typeof entityModel>(res))
      .subscribe((asyncJob) => {
        switch (asyncJob.status) {
          case JobStatus.InProgress:
            return;
          case JobStatus.Completed:
            jobSubject.next(this.getResult(asyncJob, entity, entityModel));
            break;
          case JobStatus.Failed: {
            jobSubject.error(ErrorService.parseError(this.getResponse({ error: asyncJob.result })));
            break;
          }
        }

        if (interval) {
          clearInterval(interval);
        }
        jobSubject.complete();
        this.event.next(asyncJob);
      });
  }

  private getJobId(job: any): string {
    let jobId;
    if (job instanceof AsyncJob) {
      jobId = job.id;
    } else {
      jobId = job.jobid || job;
    }

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
    if (hasEntity && (entity && entityModel)) {
      result = this.prepareModel(asyncJob.result[entity.toLowerCase()], entityModel);
      asyncJob.result = result;
    } else {
      result = asyncJob;
    }
    return result;
  }
}
