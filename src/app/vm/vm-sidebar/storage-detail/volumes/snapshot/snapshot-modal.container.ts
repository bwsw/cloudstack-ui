import { Component, Inject, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { State } from '../../../../../reducers/index';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material';
import { Volume } from '../../../../../shared/models/volume.model';
import { Snapshot } from '../../../../../shared/models/snapshot.model';
// tslint:disable-next-line
import { CreateVolumeFromSnapshotContainerComponent } from '../../../../../snapshot/snapshots-page/components/create-volume/create-volume.container';
import { TemplateResourceType } from '../../../../../template/shared/base-template.service';
// tslint:disable-next-line
import { TemplateCreationContainerComponent } from '../../../../../template/template-creation/containers/template-creation.container';
import { WithUnsubscribe } from '../../../../../utils/mixins/with-unsubscribe';

import * as volumeActions from '../../../../../reducers/volumes/redux/volumes.actions';
import * as snapshotActions from '../../../../../reducers/snapshots/redux/snapshot.actions';
import * as fromVolumes from '../../../../../reducers/volumes/redux/volumes.reducers';

@Component({
  selector: 'cs-snapshot-modal-container',
  template: `
    <cs-snapshot-modal
      [volume]="volume$ | async"
      (onTemplateCreate)="onTemplateCreate($event)"
      (onVolumeCreate)="onVolumeCreate($event)"
      (onSnapshotRevert)="onSnapshotRevert($event)"
      (onSnapshotDelete)="onSnapshotDelete($event)"
    >
    </cs-snapshot-modal>`,
})
export class SnapshotModalContainerComponent extends WithUnsubscribe() implements OnInit {
  readonly volume$ = this.store.select(fromVolumes.getSelectedVolumeWithSnapshots);

  public volume: Volume;

  constructor(
    @Inject(MAT_DIALOG_DATA) data,
    public dialogRef: MatDialogRef<SnapshotModalContainerComponent>,
    public dialog: MatDialog,
    private store: Store<State>,
  ) {
    super();
    this.store.dispatch(new volumeActions.LoadSelectedVolume(data.volumeId));
  }

  public ngOnInit() {
    this.volume$
      .takeUntil(this.unsubscribe$)
      .filter(volume => !!volume)
      .subscribe(volume => {
        // todo remove model
        this.volume = volume as Volume;
        if (!this.volume.snapshots || !this.volume.snapshots.length) {
          this.dialogRef.close();
        }
      });
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
