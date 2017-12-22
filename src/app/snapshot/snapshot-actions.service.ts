import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Observable } from 'rxjs/Observable';
import { ActionsService } from '../shared/interfaces/action-service.interface';
import { Action } from '../shared/interfaces/action.interface';
import { Snapshot, Volume } from '../shared/models';
// tslint:disable-next-line
import { TemplateCreationContainerComponent } from '../template/template-creation/containers/template-creation.container';
import { TemplateResourceType } from '../template/shared/base-template.service';


export interface SnapshotAction extends Action<Snapshot> {
  name: string;
  icon: string;
  command: string;

  activate(snapshot: Snapshot, volume?: Volume): Observable<void>;
}

@Injectable()
export class SnapshotActionsService implements ActionsService<Snapshot, SnapshotAction> {
  public actions: Array<SnapshotAction> = [
    {
      name: 'VM_PAGE.STORAGE_DETAILS.SNAPSHOT_ACTIONS.CREATE_TEMPLATE',
      icon: 'add',
      command: 'add',
      activate: (snapshot) => this.showCreationDialog(snapshot),
      canActivate: (snapshot) => true,
      hidden: (snapshot) => false
    },
    {
      name: 'COMMON.DELETE',
      icon: 'delete',
      command: 'delete',
      activate: (snapshot) => Observable.of(snapshot),
      canActivate: (snapshot) => true,
      hidden: (snapshot) => false
    },
  ];

  constructor(
    private dialog: MatDialog
  ) {
  }

  public showCreationDialog(snapshot: Snapshot): Observable<any> {
    return this.dialog.open(TemplateCreationContainerComponent, {
      width: '650px',
      panelClass: 'template-creation-dialog-snapshot',
      data: {
        mode: TemplateResourceType.template,
        snapshot
      }
    })
      .afterClosed();
  }

}
