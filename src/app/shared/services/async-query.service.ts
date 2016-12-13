import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Http } from '@angular/http';
import { JobService } from '../services/job.service';

const START_API_URL = '/client/api?command=startVirtualMachine&id=732607f3-3f8f-400c-9f14-ea9691c7f9a9&response=json';
const STOP_API_URL = '/client/api?command=stopVirtualMachine&id=732607f3-3f8f-400c-9f14-ea9691c7f9a9&response=json';

@Injectable()
export class AsyncQueryService {
  constructor(
    private http: Http,
    private jobs: JobService
  ) {}

  public startVM() {
    this.http.get(START_API_URL)
      .toPromise()
      .then(result => result.json()) //FIX HERE
      .then(result => {
        this.jobs.addJob(result.jobid, 'create').subscribe(result => console.log(result));
      })
  }
}
