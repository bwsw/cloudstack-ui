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

const API_URL = '/client/api?command=listAsyncJobs&response=json';

@Injectable()
export class JobService {
  private jobs: {};
  private doPoll: boolean;
  private timerId: any;
  private pollingInterval: number;

  constructor(private http: Http) {
    this.pollingInterval = 2000;
    this.jobs = {};
  }

  public addJob(id: string, type: string): Subject<IJob> {
     let observable = new Subject<IJob>();
     this.jobs[id] = {
       type,
       status: 0,
       observable
    };
    console.log(this.jobs);
    this.startPolling();
    return observable;
  }

  private startPolling() {
    this.timerId = setInterval(() => { this.queryJobs(); }, this.pollingInterval);
  }

  private stopPolling() {
    clearInterval(this.timerId);
  }

  private queryJobs(): void {
    console.log('im working');
    for (let job in this.jobs) {
      this.http.get(API_URL)
        .toPromise()
        .then(result => result.json().listasyncjobsresponse.asyncjobs)
        .then((result) => {
          console.log(result);
          let anyJobs = false;
          result.forEach((elem, index, array) => {
            let id = elem.jobid;
            if (elem.jobstatus === 0) {
              anyJobs = true;
            }
            if (this.jobs[id] && elem.jobstatus === 1) {
              console.log('job completed');
              this.jobs[id].jobstatus = 1;
              this.jobs[id].observable.next(elem);
              delete this.jobs[id];
            }
          });
          if (!anyJobs) {
            this.stopPolling();
          }
        });
    }
  }
}
