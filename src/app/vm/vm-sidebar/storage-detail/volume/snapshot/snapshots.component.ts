import { Component, Input } from '@angular/core';
import { Volume } from '../../../../../shared/models';
import { SnapshotActionsService } from './snapshot-actions.service';
import { SnapshotModalComponent } from './snapshot-modal.component';
import { DialogService } from '../../../../../dialog/dialog-module/dialog.service';
import { DateTimeFormatterService } from '../../../../../shared/services/date-time-formatter.service';


@Component({
  selector: 'cs-snapshots',
  templateUrl: 'snapshots.component.html',
  styleUrls: ['snapshots.component.scss']
})
export class SnapshotsComponent {
  @Input() public volume: Volume;

  constructor(
    public dateTimeFormatterService: DateTimeFormatterService,
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
