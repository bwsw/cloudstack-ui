import { Component, Input } from '@angular/core';
import { Volume } from '../../../../../shared/models';
import { SnapshotActionsService } from '../../../../../snapshot/snapshot-actions.service';
import { SnapshotModalComponent } from './snapshot-modal.component';
import { DialogService } from '../../../../../dialog/dialog-module/dialog.service';


@Component({
  selector: 'cs-snapshots',
  templateUrl: 'snapshots.component.html',
  styleUrls: ['snapshots.component.scss']
})
export class SnapshotsComponent {
  @Input() public volume: Volume;

  constructor(
    public snapshotActionsService: SnapshotActionsService,
    private dialogService: DialogService
  ) {}

  public showSnapshots(): void {
    this.dialogService.showCustomDialog({
      component: SnapshotModalComponent,
      providers: [{ provide: 'volume', useValue: this.volume }],
      styles: { width: '700px' }
    });
  }
}
