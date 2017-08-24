import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { BackendResource } from '../decorators';
import { Snapshot, Volume } from '../models';
import { AsyncJobService } from './async-job.service';
import { BaseBackendService } from './base-backend.service';
import { SnapshotService } from './snapshot.service';
import { VolumeTagService } from './tags/volume-tag.service';


interface VolumeCreationData {
  name: string;
  zoneId: string;
  diskOfferingId: string;
  size?: number;
}

export interface VolumeAttachmentData {
  id: string;
  virtualMachineId: string;
}

export interface VolumeResizeData {
  id: string;
  diskOfferingId?: string;
  size?: number;
}

@Injectable()
@BackendResource({
  entity: 'Volume',
  entityModel: Volume
})
export class VolumeService extends BaseBackendService<Volume> {
  public onVolumeAttached: Subject<Volume>;

  constructor(
    private asyncJobService: AsyncJobService,
    private snapshotService: SnapshotService,
    private volumeTagService: VolumeTagService
  ) {
    super();
    this.onVolumeAttached = new Subject<Volume>();
  }

  public get(id: string): Observable<Volume> {
    const snapshotsRequest = this.snapshotService.getList(id);
    const volumeRequest = super.get(id);

    return Observable.forkJoin(
      volumeRequest,
      snapshotsRequest
    ).map(([volume, snapshots]) => {
      volume.snapshots = snapshots;
      return volume;
    });
  }

  public getList(params?: {}): Observable<Array<Volume>> {
    const volumesRequest = super.getList(params);
    const snapshotsRequest = this.snapshotService.getList();

    return Observable.forkJoin(
      volumesRequest,
      snapshotsRequest
    ).map(([volumes, snapshots]) => {
      volumes.forEach(volume => {
        volume.snapshots = snapshots.filter(
          (snapshot: Snapshot) => snapshot.volumeId === volume.id
        );
      });
      volumes = volumes.filter(volume => !volume.isDeleted);
      return volumes;
    });
  }

  public getSpareList(params?: {}): Observable<Array<Volume>> {
    return this.getList(params).map(volumes => this.getSpareListSync(volumes));
  }

  public getSpareListSync(volumes: Array<Volume>): Array<Volume> {
    return volumes.filter(volume => !volume.virtualMachineId);
  }

  public resize(params: VolumeResizeData): Observable<Volume> {
    return this.sendCommand('resize', params).switchMap(job =>
      this.asyncJobService.queryJob(job, this.entity, this.entityModel)
    );
  }

  // TODO fix return type
  public remove(id: string): Observable<any> {
    return super.remove({ id }).map(response => {
      if (response['success'] === 'true') {
        return Observable.of(null);
      }
      return Observable.throw(response);
    });
  }

  public create(data: VolumeCreationData): Observable<Volume> {
    return this.sendCommand('create', data).switchMap(job =>
      this.asyncJobService.queryJob(job.jobid, this.entity, this.entityModel)
    );
  }

  public detach(id: string): Observable<null> {
    return this.sendCommand('detach', { id }).switchMap(job =>
      this.asyncJobService.queryJob(job, this.entity, this.entityModel)
    );
  }

  public attach(data: VolumeAttachmentData): Observable<Volume> {
    return this.sendCommand('attach', data)
      .switchMap(job =>
        this.asyncJobService.queryJob(job, this.entity, this.entityModel)
      )
      .map(jobResult => {
        this.onVolumeAttached.next(jobResult); // todo
        return jobResult;
      });
  }

  public markForRemoval(volume: Volume): Observable< Volume> {
    return this.volumeTagService.markForRemoval(volume);
  }
}
