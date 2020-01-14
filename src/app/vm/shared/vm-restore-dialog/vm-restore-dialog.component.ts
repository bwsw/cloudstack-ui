import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'cs-vm-restore-dialog',
  templateUrl: './vm-restore-dialog.component.html',
  styleUrls: ['./vm-restore-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VmRestoreDialogComponent {}
