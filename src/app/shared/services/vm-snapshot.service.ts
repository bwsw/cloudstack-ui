import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as omitBy from 'lodash/omitBy';
import * as pickBy from 'lodash/pickBy';
import { Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { VirtualMachine } from '../../vm';
import { virtualMachineEntityName } from '../../vm/shared/vm.service';
import { BackendResource } from '../decorators';
import { SnapshotFromVmSnapshotParams } from '../interfaces';
import { VmSnapshot } from '../models/vm-snapshot.model';
import { AsyncJobService } from './async-job.service';
import { BaseBackendService, CSCommands } from './base-backend.service';

export const vmSnapshotEntityName = 'VMSnapshot';

@Injectable()
@BackendResource({
  entity: vmSnapshotEntityName,
})
export class VmSnapshotService extends BaseBackendService<VmSnapshot> {
  constructor(protected http: HttpClient, private asyncJobService: AsyncJobService) {
    super(http);
  }

  public getList(params?: {}): Observable<VmSnapshot[]> {
    const extendedParams = { ...params, listall: true };
    return super
      .sendCommand('list', extendedParams)
      .pipe(map(data => (data.vmSnapshot ? data.vmSnapshot : [])));
  }

  public create(params: {}) {
    const filteredParams = omitBy(params, value => value == null || value === '');

    return super
      .sendCommand(CSCommands.Create, filteredParams)
      .pipe(switchMap(job => this.asyncJobService.queryJob(job, this.entity)));
  }

  public createSnapshotFromVMSnapshot(params: SnapshotFromVmSnapshotParams) {
    const updatedParams = pickBy(params, Boolean);

    return super
      .sendCommand('createSnapshotFrom', updatedParams)
      .pipe(switchMap(job => this.asyncJobService.queryJob(job, this.entity)));
  }

  public delete(id: string): Observable<string> {
    return super
      .sendCommand(CSCommands.Delete, { vmsnapshotid: id })
      .pipe(
        switchMap(job =>
          this.asyncJobService.queryJob(job, this.entity).pipe(switchMap(() => of(id))),
        ),
      );
  }

  public revert(id: string): Observable<VirtualMachine> {
    return super
      .sendCommand('revertTo', { vmsnapshotid: id })
      .pipe(switchMap(job => this.asyncJobService.queryJob(job, virtualMachineEntityName)));
  }
}
