import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Http } from '@angular/http';

interface IJob {
  jobid: string;
  status: number;
  observable: Subject<IJobDetails>;
}

interface IJobDetails {
  jobid: string;
  jobstatus: number,
  jobresultcode: number,
  jobresult: any;
}

@Injectable()
export class JobService {
  private jobs: {};
  private doQuery: boolean;

  constructor(http: Http) {}

  public addJob(id: string): Subject<IJob> {
     let obs = new Subject<IJob>();
     this.jobs[id] = {
       status: 0,
       observable: obs
    };
    obs.subscribe(result => {
      this.onJobStatusChange(result);
    });
    return obs;
  }

  public onJobStatusChange(result: any) {}

  private queryJobs(): void {
    for (let job in this.jobs) {
      //... check jobs' statuses
    }
  }
}
