import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Observer, Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { BackendResource } from '../decorators';
import { AsyncJob, mapCmd } from '../models';
import { BaseBackendService, CSCommands } from './base-backend.service';
import { ErrorService } from './error.service';

const enum JobStatus {
  InProgress,
  Completed,
  Failed,
}

@Injectable()
@BackendResource({
  entity: 'AsyncJob',
})
export class AsyncJobService extends BaseBackendService<AsyncJob<any>> {
  public event: Subject<AsyncJob<any>>;
  public pollingInterval: number;
  public immediatePollingInterval: number;
  private timerIds: any[] = [];
  private jobs: Subject<AsyncJob<any>>[] = [];

  constructor(protected http: HttpClient) {
    super(http);
    this.pollingInterval = 2000;
    this.immediatePollingInterval = 100;
    this.event = new Subject<AsyncJob<any>>();
  }

  public queryJob(job: any, entity: string): Observable<any> {
    const jobId = this.getJobId(job);
    const jobObservable = Observable.create(observer => {
      let interval;
      setTimeout(() => {
        this.jobRequest(jobId, observer, entity);
        interval = setInterval(() => {
          if (jobObservable.isStopped) {
            clearInterval(interval);
            return;
          }
          this.jobRequest(jobId, observer, entity, interval);
        }, this.pollingInterval);
        this.timerIds.push(interval);
      }, this.immediatePollingInterval);

      return () => clearInterval(interval);
    });
    this.jobs.push(jobObservable);

    return jobObservable;
  }

  public completeAllJobs(): void {
    this.timerIds.forEach(clearInterval);
    this.jobs = [];
    this.timerIds = [];
  }

  private jobRequest(
    jobId: string,
    observer: Observer<AsyncJob<any>>,
    entity: string,
    interval?: any,
  ): void {
    this.sendCommand(CSCommands.QueryResult, { jobId })
      .pipe(map(res => res as AsyncJob<any>))
      .subscribe(asyncJob => {
        switch (asyncJob.jobstatus) {
          case JobStatus.InProgress:
            return;
          case JobStatus.Completed:
            observer.next(this.getResult(asyncJob, entity));
            break;
          case JobStatus.Failed: {
            observer.error(
              ErrorService.parseError(this.getResponse({ error: asyncJob.jobresult })),
            );
            break;
          }
          default:
            break;
        }

        if (interval) {
          clearInterval(interval);
          this.timerIds.filter(id => interval !== id);
        }
        observer.complete();
        this.event.next({ ...asyncJob, cmd: mapCmd(asyncJob) });
      });
  }

  private getJobId(job: any): string {
    const jobId = this.isAsyncJob(job) ? job.jobid : job.jobid || job;

    if (typeof jobId !== 'string') {
      throw new Error('Unsupported job format');
    }
    return jobId;
  }

  private isAsyncJob(job) {
    return job.id !== undefined;
  }

  private getResult(asyncJob: AsyncJob<any>, entity: string): any {
    // when response is just success: true/false
    if (asyncJob.jobresult && asyncJob.jobresult.success) {
      return asyncJob.jobresult;
    }

    const hasEntity = asyncJob.jobinstancetype || asyncJob.jobresulttype;

    if (hasEntity && entity) {
      return asyncJob.jobresult[entity.toLowerCase()];
    }
    return asyncJob;
  }
}
