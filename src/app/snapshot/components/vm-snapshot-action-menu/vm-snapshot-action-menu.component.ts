import { Component, Input, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { State, vmSnapshotsActions } from '../../../root-store';
import { VmState } from '../../../vm/shared/vm.model';
import { VmSnapshotSidebarViewModel } from '../../models/vm-snapshot-sidebar.view-model';
import { VmSnapshotViewModel } from '../../models/vm-snapshot.view-model';

@Component({
  selector: 'cs-vm-snapshot-action-menu',
  templateUrl: './vm-snapshot-action-menu.component.html',
  styleUrls: ['./vm-snapshot-action-menu.component.scss'],
})
export class VmSnapshotActionMenuComponent implements OnInit {
  @Input()
  public snapshot: VmSnapshotViewModel | VmSnapshotSidebarViewModel;
  public vmStates = VmState;

  constructor(private store: Store<State>) {}

  ngOnInit() {}

  public onCreateVolumeSnapshot() {
    this.store.dispatch(
      new vmSnapshotsActions.CreateVolumeSnapshot({ snapshotId: this.snapshot.id }),
    );
  }

  public onRevertVmToSnapshot() {
    this.store.dispatch(new vmSnapshotsActions.Revert({ id: this.snapshot.id }));
  }

  public onDelete() {
    this.store.dispatch(new vmSnapshotsActions.Delete({ id: this.snapshot.id }));
  }
}
