import { Component, Input } from '@angular/core';
import { MdDialog } from '@angular/material';
import { Volume } from '../../../../shared/models/volume.model';
import {
  SnapshotCreationComponent
} from '../../../../vm/vm-sidebar/storage-detail/volume/snapshot-creation/snapshot-creation.component';


@Component({
  selector: 'cs-spare-drive-snapshot-creation',
  templateUrl: 'spare-drive-snapshot-creation.component.html',
  styleUrls: ['spare-drive-snapshot-creation.component.scss']
})
export class SpareDriveSnapshotCreationComponent {
  @Input() public volume: Volume;

  constructor(private dialog: MdDialog) {}

  public addSnapshot(): void {
    this.dialog.open(SnapshotCreationComponent,
      {
        data: { volume: this.volume },
        width: '400px'
      }
    );
  }
}
