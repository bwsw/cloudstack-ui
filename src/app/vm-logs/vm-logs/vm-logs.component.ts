import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import { State } from '../../root-store';
import * as vmLogsActions from '../redux/vm-logs.actions';

@Component({
  selector: 'cs-vm-logs',
  templateUrl: 'vm-logs.component.html',
  styleUrls: ['vm-logs.component.scss'],
})
export class VmLogsComponent {
  @Input()
  public isAutoUpdateEnabled: boolean;
  @Input()
  public selectedVmId: string;
  @Output()
  public autoUpdateStarted = new EventEmitter<void>();
  @Output()
  public autoUpdateStopped = new EventEmitter<void>();

  constructor(private store: Store<State>) {}

  public onScroll() {
    this.store.dispatch(new vmLogsActions.ScrollVmLogs());
  }
}
