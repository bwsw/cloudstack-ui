import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { State } from '../../../../../reducers/index';
import { Volume } from '../../../../../shared/models/volume.model';
import { Snapshot } from '../../../../../shared/models/snapshot.model';
// tslint:disable-next-line
import { CreateVolumeFromSnapshotContainerComponent } from '../../../../../snapshot/snapshots-page/components/create-volume/create-volume.container';
import { TemplateResourceType } from '../../../../../template/shared/base-template.service';
// tslint:disable-next-line
import { TemplateCreationContainerComponent } from '../../../../../template/template-creation/containers/template-creation.container';

import * as snapshotActions from '../../../../../reducers/snapshots/redux/snapshot.actions';

@Component({
  selector: 'cs-snapshots-container',
  template: `
    <cs-snapshots
      [volume]="volume"
      (onTemplateCreate)="onTemplateCreate($event)"
      (onVolumeCreate)="onVolumeCreate($event)"
      (onSnapshotRevert)="onSnapshotRevert($event)"
      (onSnapshotDelete)="onSnapshotDelete($event)"
    >
    </cs-snapshots>`,
})
export class SnapshotsContainerComponent {
  @Input() public volume: Volume;

  constructor(
    private dialog: MatDialog,
    private store: Store<State>
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
    this.store.dispatch(new snapshotActions.RevertVolumeToSnapshot(snapshot));
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
