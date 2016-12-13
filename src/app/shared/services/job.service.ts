import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Http } from '@angular/http';

interface IJob {
  jobid: string;
  type: string;
  jobstatus: number;
  observable: Subject<IJobDetails>;
}

interface IJobDetails {
  jobid: string;
  jobstatus: number,
  jobresultcode: number,
  jobresult: any;
}

const API_URL = '/client/api?command=listAsyncJobs&result=json';

@Injectable()
export class JobService {
  private jobs: Array<IJob>;
  private doQuery: boolean;
  private timerId: any;
  private pollingInterval: number;

  constructor(private http: Http) {
    this.pollingInterval = 2000;
  }

  public addJob(id: string, type: string): Subject<IJob> {
     let observable = new Subject<IJob>();
     this.jobs[id] = {
       type,
       status: 0,
       observable
    };
    observable.subscribe(result => {
      this.onJobStatusChange(result);
    });
    this.startPolling();
    return observable;
  }

  private startPolling() {
    this.timerId = setInterval(this.queryJobs, this.pollingInterval);
  }

  public onJobStatusChange(result: any) {}

  private queryJobs(): void {
    for (let job in this.jobs) {
      this.http.get(API_URL)
        .toPromise()
        .then(result => result.json().asyncjobs)
        .then((result: Array<IJob>) => {
          result.forEach((elem, index, array) => {
            if (this.jobs[elem.jobid] && elem.jobstatus === 1) {
              this.jobs[elem.jobid]
            }
          });
        });
    }
  }
}
