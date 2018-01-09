import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BackendResource } from '../decorators';
import { AsyncJob, Snapshot } from '../models';
import { AsyncJobService } from './async-job.service';
import { BaseBackendCachedService } from './base-backend-cached.service';
import { SnapshotTagService } from './tags/snapshot-tag.service';


@Injectable()
@BackendResource({
  entity: 'Snapshot'
})
export class SnapshotService extends BaseBackendCachedService<Snapshot> {

  constructor(
    private asyncJobService: AsyncJobService,
    private snapshotTagService: SnapshotTagService,
    protected http: HttpClient
  ) {
    super(http);
  }

  public create(
    volumeId: string,
    name?: string,
    description?: string
  ): Observable<Snapshot> {
    this.invalidateCache();

    const params = this.getSnapshotCreationParams(volumeId, name);
    return this.sendCommand('create', params)
      .switchMap(job => this.asyncJobService.queryJob(job, this.entity, this.entityModel))
      .switchMap((response: AsyncJob<Snapshot>) => {
        const snapshot = response.jobresult.snapshot;

        if (description) {
          return this.snapshotTagService.setDescription(snapshot, description);
        }

        return Observable.of(snapshot);
      });
  }

  public markForRemoval(snapshot: Snapshot): Observable<Snapshot> {
    return this.snapshotTagService.markForRemoval(snapshot);
  }

  public remove(id: string): Observable<any> {
    this.invalidateCache();
    return this.sendCommand('delete', { id })
      .switchMap(job => this.asyncJobService.queryJob(job.jobid));
  }

  public revert(id: string): Observable<any> {
    return this.sendCommand('revert', { id })
      .switchMap(job => this.asyncJobService.queryJob(job.jobid));
  }

  public getList(volumeId?: string): Observable<Array<Snapshot>> {
    if (volumeId) {
      return super.getList({ volumeId: volumeId });
    }
    return super.getList();
  }

  public getVmSnapshotsList(virtualMachineId?: string): Observable<Array<Snapshot>> {
    if (virtualMachineId) {
      return super.getRequest(
        'listVM',
        { virtualMachineId: virtualMachineId },
      ).map(res => res['listvmsnapshotresponse']['vmSnapshot']);
    }
    return super.getRequest('listVM')
      .map(res => res['listvmsnapshotresponse']['vmSnapshot']);
  }

  private getSnapshotCreationParams(volumeId: string, name?: string): any {
    if (name) {
      return {
        volumeId: volumeId,
        name
      };
    }

    return {
      volumeId
    };
  }
}
