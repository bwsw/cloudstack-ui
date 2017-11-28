import {
  Component,
  Inject,
  OnInit
} from '@angular/core';
import { Store } from '@ngrx/store';
import { State } from '../../../../../reducers/index';
import {
  MAT_DIALOG_DATA,
  MatDialogRef
} from '@angular/material';
import { Volume } from '../../../../../shared/models/volume.model';
import {
  TableDatabase,
  TableDataSource
} from '../../../../../shared/components/table/table';
import * as volumeActions from '../../../../../reducers/volumes/redux/volumes.actions';


@Component({
  selector: 'cs-snapshot-modal-container',
  template: `
    <cs-snapshot-modal
      [volume]="volume"
      [dataBase]="dataBase"
      [dataSource]="dataSource"
      (onSnapshotDelete)="snapshotDeleted($event)"
    >
    </cs-snapshot-modal>`,
})
export class SnapshotModalContainerComponent implements OnInit {
  public volume: Volume;
  public dataBase: TableDatabase;
  public dataSource: TableDataSource | null;

  constructor(
    @Inject(MAT_DIALOG_DATA) data,
    public dialogRef: MatDialogRef<SnapshotModalContainerComponent>,
    private store: Store<State>,
  ) {
    this.volume = data.volume;
  }

  public ngOnInit() {
    this.update();
  }

  public update() {
    this.dataBase = new TableDatabase(this.volume.snapshots);
    this.dataSource = new TableDataSource(this.dataBase);
  }

  public snapshotDeleted(volume: Volume) {
    this.volume = volume;
    this.store.dispatch(new volumeActions.UpdateVolume(this.volume));
    this.update();
  }
}
