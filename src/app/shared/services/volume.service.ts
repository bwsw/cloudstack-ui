import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Observable } from 'rxjs';

import { Volume } from '../models/volume.model';
import { BaseBackendService, BACKEND_API_URL } from './base-backend.service';
import { BackendResource } from '../decorators/backend-resource.decorator';
import { AsyncJobService } from './async-job.service';
import { AsyncJob } from '../models/async-job.model';


@Injectable()
@BackendResource({
  entity: 'Volume',
  entityModel: Volume
})
export class VolumeService extends BaseBackendService<Volume> {
  constructor(private asyncJobService: AsyncJobService) {
    super();
  }

  public resize(id: string, params: { size: number, shrinkok: boolean, [propName: string]: any }) {
    params['id'] = id;

    return this.http.get(BACKEND_API_URL, { search: this.buildParams('resize', params) })
      .map((response: Response) => response.json())
      .flatMap((res: any) => {
        const responseKey = `resize${this.entity.toLowerCase()}response`;
        return this.asyncJobService.addJob(res[responseKey].jobid);
      })
      .flatMap((asyncJob: AsyncJob) => {
        const jobResult = asyncJob.jobResult;
        if (asyncJob.jobStatus === 2) {
          return Observable.throw(jobResult);
        }

        return Observable.of(this.prepareModel(jobResult.volume));
      });
  }
}

