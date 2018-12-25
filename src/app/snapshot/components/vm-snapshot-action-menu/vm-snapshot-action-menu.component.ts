import { Component, Input, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { State, vmSnapshotsSelectors } from '../../../root-store';
import { EntityAction } from '../../../shared/interfaces';
import { VmSnapshotViewModel } from '../../models/vm-snapshot.view-model';

@Component({
  selector: 'cs-vm-snapshot-action-menu',
  templateUrl: './vm-snapshot-action-menu.component.html',
  styleUrls: ['./vm-snapshot-action-menu.component.scss'],
})
export class VmSnapshotActionMenuComponent implements OnInit {
  @Input()
  public snapshot: VmSnapshotViewModel;
  public actions$: Observable<EntityAction[]>;

  constructor(private store: Store<State>) {}

  public ngOnInit() {
    this.actions$ = this.store.pipe(
      select(vmSnapshotsSelectors.getVmSnapshotEntityActions(this.snapshot.id)),
    );
  }
}
