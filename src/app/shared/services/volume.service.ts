import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { VirtualMachine } from '../../vm/shared/vm.model';
import { BackendResource } from '../decorators';
import { Snapshot, Volume } from '../models';
import { AsyncJobService } from './async-job.service';
import { BaseBackendService } from './base-backend.service';
import { SnapshotService } from './snapshot.service';
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

export interface VolumeResizeData {
  id: string;
  diskOfferingId?: string;
  size?: number;
}

export interface VolumeAttachmentEvent {
  volumeId: string,
  virtualMachineId?: string,
  event: VolumeAttachmentEventType
}

export type VolumeAttachmentEventType = 'attached' | 'detached';
export const VolumeAttachmentEventsTypes = {
  ATTACHED: 'attached' as VolumeAttachmentEventType,
  DETACHED: 'detached' as VolumeAttachmentEventType
};

@Injectable()
@BackendResource({
  entity: 'Volume',
  entityModel: Volume
})
export class VolumeService extends BaseBackendService<Volume> {
  public onVolumeAttachment = new Subject<VolumeAttachmentEvent>();
  public onVolumeResized = new Subject<Volume>();
  public onVolumeRemoved = new Subject<Volume>();

  constructor(
    private asyncJobService: AsyncJobService,
    private snapshotService: SnapshotService,
    private tagService: TagService
  ) {
    super();
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
      return volumes;
    });
  }

  public getSpareList(params?: {}): Observable<Array<Volume>> {
    return this.getList(params).map(volumes => {
      return volumes.filter((volume: Volume) => {
        return !volume.virtualMachineId && !volume.isDeleted;
      });
    });
  }

  public resize(params: VolumeResizeData): Observable<Volume> {
    return this.sendCommand('resize', params).switchMap(job =>
      this.asyncJobService.queryJob(job, this.entity, this.entityModel)
    )
      .do(jobResult => this.onVolumeResized.next(jobResult));
  }

  // TODO fix return type
  public remove(volume: Volume): Observable<any> {
    return super.remove({ id: volume.id }).map(response => {
      if (response['success'] === 'true') {
          this.onVolumeRemoved.next(volume);
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

  public detach(volume: Volume): Observable<null> {
    return this.sendCommand('detach', { id: volume.id }).switchMap(job =>
      this.asyncJobService.queryJob(job, this.entity, this.entityModel)
    )
      .do(jobResult => this.onVolumeAttachment.next({
        volumeId: volume.id,
        event: VolumeAttachmentEventsTypes.DETACHED
      }));
  }

  public attach(data: VolumeAttachmentData): Observable<Volume> {
    return this.sendCommand('attach', data)
      .switchMap(job =>
        this.asyncJobService.queryJob(job, this.entity, this.entityModel)
      )
      .do(jobResult => this.onVolumeAttachment.next({
        volumeId: data.id,
        virtualMachineId: data.virtualMachineId,
        event: VolumeAttachmentEventsTypes.ATTACHED
      }));
  }

  public markForDeletion(id: string): Observable<any> {
    return this.tagService.create({
      resourceIds: id,
      resourceType: this.entity,
      'tags[0].key': 'status',
      'tags[0].value': 'removed'
    });
  }

  public getDescription(volume: Volume): Observable<string> {
    return this.tagService.getTag(volume, 'csui.volume.description')
      .map(tag =>  tag ? tag.value : undefined);
  }

  public updateDescription(vm: Volume, description: string): Observable<void> {
    return this.tagService.update(
      vm,
      'Volume',
      'csui.volume.description',
      description
    );
  }
}
