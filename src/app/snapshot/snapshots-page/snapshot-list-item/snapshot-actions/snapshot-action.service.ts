import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Observable } from 'rxjs';

import { Action, Snapshot, SnapshotStates } from '../../../../shared/models';
import { templateResourceType } from '../../../../template/shared/base-template.service';
// tslint:disable-next-line
import { TemplateCreationContainerComponent } from '../../../../template/template-creation/containers/template-creation.container';
import { CreateVolumeFromSnapshotContainerComponent } from '../../components/create-volume/create-volume.container';

export enum SnapshotActions {
  CreateTemplate,
  CreateVolume,
  Delete,
  Revert,
}

const createTemplateFromSnapshotAction: Action<Snapshot> = {
  name: 'SNAPSHOT_PAGE.ACTIONS.CREATE_TEMPLATE',
  command: SnapshotActions.CreateTemplate,
  icon: 'mdi-disc',
  canActivate: (snapshot: Snapshot) => snapshot.state === SnapshotStates.BackedUp,
};

const createVolumeFromSnapshotAction: Action<Snapshot> = {
  name: 'SNAPSHOT_PAGE.ACTIONS.CREATE_VOLUME',
  command: SnapshotActions.CreateVolume,
  icon: 'mdi-dns',
  canActivate: (snapshot: Snapshot) => snapshot.state === SnapshotStates.BackedUp,
};

const snapshotDeleteAction: Action<Snapshot> = {
  name: 'SNAPSHOT_PAGE.ACTIONS.DELETE_SNAPSHOT',
  command: SnapshotActions.Delete,
  icon: 'mdi-delete',
  canActivate: (snapshot: Snapshot) => true,
};

const snapshotRevertAction: Action<Snapshot> = {
  name: 'SNAPSHOT_PAGE.ACTIONS.REVERT_TO_SNAPSHOT',
  command: SnapshotActions.Revert,
  icon: 'mdi-backup-restore',
  canActivate: (snapshot: Snapshot) =>
    snapshot.revertable && snapshot.state === SnapshotStates.BackedUp,
};

@Injectable()
export class SnapshotActionService {
  public actions: Action<Snapshot>[] = [
    createTemplateFromSnapshotAction,
    createVolumeFromSnapshotAction,
    snapshotRevertAction,
    snapshotDeleteAction,
  ];

  constructor(private dialog: MatDialog) {}

  public showTemplateCreationDialog(snapshot: Snapshot): Observable<any> {
    return this.dialog
      .open(TemplateCreationContainerComponent, {
        width: '650px',
        panelClass: 'template-creation-dialog-snapshot',
        data: {
          snapshot,
          mode: templateResourceType.template,
        },
      })
      .afterClosed();
  }

  public showVolumeCreationDialog(snapshot: Snapshot): Observable<any> {
    return this.dialog
      .open(CreateVolumeFromSnapshotContainerComponent, {
        width: '405px',
        data: {
          snapshot,
          mode: templateResourceType.template,
        },
      })
      .afterClosed();
  }
}
