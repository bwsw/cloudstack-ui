import { Component, Input } from '@angular/core';
import { DialogService } from '../../../../dialog/dialog-module/dialog.service';
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

  constructor(private dialogService: DialogService) {}

  public addSnapshot(): void {
    this.dialogService.showCustomDialog({
      component: SnapshotCreationComponent,
      classes: 'snapshot-creation-dialog',
      providers: [{ provide: 'volume', useValue: this.volume }],
    });
  }
}
