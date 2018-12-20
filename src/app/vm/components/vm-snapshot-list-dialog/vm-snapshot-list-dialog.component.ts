import { Component } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { State, vmSnapshotsSelectors } from '../../../root-store';

@Component({
  selector: 'cs-vm-snapshot-list-dialog',
  templateUrl: './vm-snapshot-list-dialog.component.html',
  styleUrls: ['./vm-snapshot-list-dialog.component.scss'],
})
export class VmSnapshotListDialogComponent {
  public displayedColumns: string[] = ['name', 'description', 'date', 'actions'];
  public vmSnapshots$ = this.store.pipe(select(vmSnapshotsSelectors.getVmSnapshotsForSelectedVm));
  public vmSnapshotActionsEntities$ = this.store.pipe(
    select(vmSnapshotsSelectors.getVmSnapshotEntityActionsEntities),
  );

  constructor(public store: Store<State>) {}
}
