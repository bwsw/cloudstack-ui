import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DiskOffering } from '../../../models/index';
import { MatDialog } from '@angular/material';
import { DiskOfferingDialogComponent } from '../disk-offering-dialog/disk-offering-dialog.component';

@Component({
  selector: 'cs-disk-offering-selector-chooser',
  templateUrl: 'disk-offering-selector-chooser.component.html',
  styleUrls: ['disk-offering-selector-chooser.component.scss'],
})
export class DiskOfferingSelectorChooserComponent {
  @Input()
  public diskOfferings: DiskOffering[];
  @Input()
  public availableStorage: number | 'Unlimited';
  @Input()
  public diskOffering: DiskOffering;
  @Output()
  public changed = new EventEmitter();

  constructor(private dialog: MatDialog) {}

  public changeOffering(): void {
    this.dialog
      .open(DiskOfferingDialogComponent, {
        width: '750px',
        data: {
          diskOfferings: this.diskOfferings,
          diskOffering: this.diskOffering,
          storageAvailable: this.availableStorage,
        },
      })
      .afterClosed()
      .subscribe((offering: DiskOffering) => {
        if (offering) {
          this.diskOffering = offering;
          this.changed.next(offering);
        }
      });
  }
}
