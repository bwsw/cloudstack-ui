import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';

import { Volume } from '../models/volume.model';
import { BaseBackendService } from './base-backend.service';
import { BackendResource } from '../decorators/backend-resource.decorator';
import { SnapshotService } from './snapshot.service';
import { Snapshot } from '../models/snapshot.model';
import { AsyncJobService } from './async-job.service';
import { AsyncJob } from '../models/async-job.model';


@Injectable()
@BackendResource({
  entity: 'Volume',
  entityModel: Volume
})
export class VolumeService extends BaseBackendService<Volume> {
  constructor(
    private snapshotService: SnapshotService,
    private asyncJobService: AsyncJobService
  ) {
    super();
  }

  public get(id: string): Observable<Volume> {
    const snapshotsRequest = this.snapshotService.getList(id);
    const volumeRequest = super.get(id);

    return Observable.forkJoin([volumeRequest, snapshotsRequest])
      .map(([volume, snapshots]) => {
        volume.snapshots = snapshots;
        return volume;
      });
  }

  public getList(params?: {}): Observable<Array<Volume>> {
    const volumesRequest = super.getList(params);
    const snapshotsRequest = this.snapshotService.getList();

    return Observable.forkJoin([volumesRequest, snapshotsRequest])
      .map(([volumes, snapshots]) => {
        volumes.forEach(volume => {
          volume.snapshots = snapshots.filter((snapshot: Snapshot) => snapshot.volumeId === volume.id);
        });
        return volumes;
      });
  }

  public resize(id: string, params: { size: number, [propName: string]: any }): Observable<Volume> {
    params['id'] = id;

    return this.sendCommand('resize', params)
      .flatMap((job: any) => this.asyncJobService.addJob(job.jobid))
      .flatMap((asyncJob: AsyncJob) => {
        const jobResult = asyncJob.jobResult;
        if (asyncJob.jobStatus === 2) {
          return Observable.throw(jobResult);
        }

        return Observable.of(this.prepareModel(jobResult.volume));
      });
  }
}
