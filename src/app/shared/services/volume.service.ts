import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs/Rx';

import { Volume } from '../models/volume.model';
import { BaseBackendService } from './base-backend.service';
import { BackendResource } from '../decorators/backend-resource.decorator';
import { SnapshotService } from './snapshot.service';
import { Snapshot } from '../models/snapshot.model';
import { AsyncJobService } from './async-job.service';
import { TagService } from './tag.service';


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

export const deletionMark = 'toBeDeleted';


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

  public resize(id: string, params: { size: number, [propName: string]: any }): Observable<Volume> {
    params['id'] = id;

    return this.sendCommand('resize', params)
      .switchMap(job => this.asyncJobService.register(job, this.entity, this.entityModel))
      .map(job => job.jobResult);
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
      .switchMap(job => this.asyncJobService.register(job.jobid, this.entity, this.entityModel))
      .map(job => job.jobResult);
  }

  public detach(id: string): Observable<null> {
    return this.sendCommand('detach', { id })
      .switchMap(job => this.asyncJobService.register(job, this.entity, this.entityModel));
  }

  public attach(data: VolumeAttachmentData): Observable<Volume> {
    return this.sendCommand('attach', data)
      .switchMap(job => this.asyncJobService.register(job.jobid, this.entity, this.entityModel))
      .map(job => {
        this.onVolumeAttached.next(job.jobResult);
        return job.jobResult;
      });
  }

  public markForDeletion(id: string): Observable<any> {
    return this.tagsService.create({
      resourceIds: id,
      resourceType: this.entity,
      'tags[0].key': deletionMark,
      'tags[0].value': 'true',
    })
      .switchMap(tagJob => this.asyncJobService.addJob(tagJob.jobid));
  }

  public removeMarkedVolumes(): void {
    this.getList({
      'tags[0].key': deletionMark,
      'tags[0].value': 'true'
    })
      .subscribe(volumes => {
        volumes
          .filter(volume => !volume.virtualMachineId)
          .forEach(volume => this.remove(volume.id).subscribe());
      });
  }
}
