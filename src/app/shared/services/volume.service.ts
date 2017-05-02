import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import { DeletionMark, Volume, Snapshot } from '../models';
import { BaseBackendService } from './base-backend.service';
import { BackendResource } from '../decorators';
import { SnapshotService } from './snapshot.service';
import { AsyncJobService } from './async-job.service';
import { TagService } from './tag.service';


export interface VolumeCreationData {
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
  public onVolumeAttached = new Subject<Volume>();

  constructor(
    private asyncJobService: AsyncJobService,
    private snapshotService: SnapshotService,
    private tagsService: TagService
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

  public resize(params: VolumeResizeData): Observable<Volume> {
    return this.sendCommand('resize', params)
      .switchMap(job => this.asyncJobService.queryJob(job, this.entity, this.entityModel));
  }

  public remove(id: string): Observable<null> {
    return super.remove({ id })
      .map(response => {
        if (response['success'] === 'true') {
          return Observable.of(null);
        }
        return Observable.throw(response);
      });
  }

  public create(data: VolumeCreationData): Observable<Volume> {
    return this.sendCommand('create', data)
      .switchMap(job => this.asyncJobService.queryJob(job.jobid, this.entity, this.entityModel));
  }

  public detach(id: string): Observable<null> {
    return this.sendCommand('detach', { id })
      .switchMap(job => this.asyncJobService.queryJob(job, this.entity, this.entityModel));
  }

  public attach(data: VolumeAttachmentData): Observable<Volume> {
    return this.sendCommand('attach', data)
      .switchMap(job => this.asyncJobService.queryJob(job, this.entity, this.entityModel))
      .map(jobResult => {
        this.onVolumeAttached.next(jobResult); // todo
        return jobResult;
      });
  }

  public markForDeletion(id: string): Observable<any> {
    return this.tagsService.create({
      resourceIds: id,
      resourceType: this.entity,
      'tags[0].key': DeletionMark.TAG,
      'tags[0].value': DeletionMark.VALUE
    });
  }
}
