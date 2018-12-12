import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { EntityAction } from '../../../shared/interfaces';
import { VmSnapshot } from '../../../shared/models/vm-snapshot.model';

@Component({
  selector: 'cs-vm-snapshots-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './vm-snapshots-sidebar-card.component.html',
  styleUrls: ['./vm-snapshots-sidebar-card.component.scss'],
})
export class VmSnapshotsSidebarCardComponent {
  @Input()
  public lastVmSnapshot: VmSnapshot;
  @Input()
  public vmSnapshotsCount: number;
  @Input()
  public entityActions: EntityAction[];
  @Output()
  public createButtonClicked = new EventEmitter<void>();
  @Output()
  public showAllVMSnapshotsButtonClicked = new EventEmitter<void>();

  public showAllSnapshots() {
    this.showAllVMSnapshotsButtonClicked.emit();
  }

  public onCreateButtonClicked() {
    this.createButtonClicked.emit();
  }
}
