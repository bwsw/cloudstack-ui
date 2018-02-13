import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { BackendResource } from '../decorators';
import { Volume, isDeleted, VolumeCreationData } from '../models';
import { AsyncJobService } from './async-job.service';
import { BaseBackendService, CSCommands } from './base-backend.service';
import { SnapshotService } from './snapshot.service';
import { VolumeTagService } from './tags/volume-tag.service';
import { AsyncJob } from '../models/async-job.model';

export interface VolumeFromSnapshotCreationData {
  name: string;
  snapshotId: string;
}

export interface VolumeAttachmentData {
  id: string;
  virtualMachineId: string;
}

export interface VolumeResizeData {
  id: string;
  diskofferingid?: string;
  size?: number;
}

@Injectable()
@BackendResource({
  entity: 'Volume'
})
export class VolumeService extends BaseBackendService<Volume> {
  public onVolumeResized = new Subject<Volume>();

  constructor(
    private asyncJobService: AsyncJobService,
    private snapshotService: SnapshotService,
    private volumeTagService: VolumeTagService,
    protected http: HttpClient
  ) {
    super(http);
  }

  public getList(params?: {}): Observable<Array<Volume>> {
    return super.getList(params)
      .map((volumes: Volume[]) => volumes.filter(volume => !isDeleted(volume)));
  }

  public resize(params: VolumeResizeData): Observable<Volume> {
    return this.sendCommand(CSCommands.Resize, params).switchMap(job =>
      this.asyncJobService.queryJob(job, this.entity, this.entityModel)
    )
      .switchMap((response: AsyncJob<Volume>) => Observable.of(response.jobresult['volume']))
      .do(jobResult => this.onVolumeResized.next(jobResult));
  }

  // TODO fix return type
  public remove(volume: Volume): Observable<any> {
    return super.remove({ id: volume.id }).map(response => {
      if (response['success'] === 'true') {
        return Observable.of(null);
      }
      return Observable.throw(response);
    });
  }

  public create(data: VolumeCreationData): Observable<Volume> {
    return this.sendCommand(CSCommands.Create, data)
      .switchMap(job =>
        this.asyncJobService.queryJob(job.jobid, this.entity, this.entityModel)
      )
      .switchMap((response: AsyncJob<Volume>) => Observable.of(response.jobresult['volume']));
  }

  public createFromSnapshot(data: VolumeFromSnapshotCreationData): Observable<AsyncJob<Volume>> {
    return this.sendCommand(CSCommands.Create, data).switchMap(job =>
      this.asyncJobService.queryJob(job.jobid, this.entity, this.entityModel)
    );
  }

  public detach(volume: Volume): Observable<Volume> {
    return this.sendCommand(CSCommands.Detach, { id: volume.id })
      .switchMap(job =>
        this.asyncJobService.queryJob(job, this.entity, this.entityModel)
      )
      .switchMap((response: AsyncJob<Volume>) => Observable.of(response.jobresult['volume']));
  }

  public attach(data: VolumeAttachmentData): Observable<Volume> {
    return this.sendCommand(CSCommands.Attach, data)
      .switchMap(job =>
        this.asyncJobService.queryJob(job, this.entity, this.entityModel)
      )
      .switchMap((response: AsyncJob<Volume>) => Observable.of(response.jobresult['volume']));
  }

  public markForRemoval(volume: Volume): Observable<any> {
    const observers = volume.snapshots.map((snapshot) => this.snapshotService.markForRemoval(
      snapshot));
    return Observable.forkJoin(
      ...observers,
      this.volumeTagService.markForRemoval(volume)
    );
  }
}
