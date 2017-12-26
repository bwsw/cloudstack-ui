import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Observable } from 'rxjs/Observable';
import { State } from '../../../../reducers';
import { Snapshot } from '../../../../shared/models';
import { Store } from '@ngrx/store';
import { TemplateResourceType } from '../../../../template/shared/base-template.service';
// tslint:disable-next-line
import { TemplateCreationContainerComponent } from '../../../../template/template-creation/containers/template-creation.container';
import { CreateVolumeFromSnapshotContainerComponent } from '../../components/create-volume.container';

import * as snapshotActions from '../../../../reducers/snapshots/redux/snapshot.actions';

@Component({
  selector: 'cs-snapshot-action-container',
  template: `
    <cs-snapshot-action
      [snapshot]="snapshot"
      (onTemplateCreate)="onTemplateCreate($event)"
      (onVolumeCreate)="onVolumeCreate($event)"
      (onSnapshotDelete)="onSnapshotDelete($event)"
      (onSnapshotRevert)="onSnapshotRevert($event)"
    >
    </cs-snapshot-action>`,
})
export class SnapshotActionContainerComponent {
  @Input() public snapshot: Snapshot;

  constructor(
    private store: Store<State>,
    private dialog: MatDialog
  ) {
  }

  public onTemplateCreate(snapshot: Snapshot) {
    this.showTemplateCreationDialog(snapshot);
  }

  public onVolumeCreate(snapshot: Snapshot) {
    this.showVolumeCreationDialog(snapshot);
  }

  public onSnapshotDelete(snapshot: Snapshot): void {
    this.store.dispatch(new snapshotActions.DeleteSnapshot(snapshot));
  }

  public onSnapshotRevert(snapshot: Snapshot): void {
  }

  private showTemplateCreationDialog(snapshot: Snapshot): Observable<any> {
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

  private showVolumeCreationDialog(snapshot: Snapshot): Observable<any> {
    return this.dialog.open(CreateVolumeFromSnapshotContainerComponent, {
      width: '405px',
      data: {
        mode: TemplateResourceType.template,
        snapshot
      }
    })
      .afterClosed();
  }
}
