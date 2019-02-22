import { Component } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { debounceTime } from 'rxjs/operators';
import { State } from '../../reducers';
import * as fromVmLogsAutoUpdate from '../redux/vm-logs-auto-update.reducers';
import * as vmLogsActions from '../redux/vm-logs.actions';
import * as fromVmLogs from '../redux/vm-logs.reducers';

@Component({
  selector: 'cs-vm-logs-container',
  template: `
    <cs-vm-logs
      [isAutoUpdateEnabled]="isAutoUpdateEnabled$ | async"
      [selectedVmId]="selectedVmId$ | async"
      [newestFirst]="newestFirst$ | async"
      (autoUpdateStarted)="onAutoUpdate()"
      (autoUpdateStopped)="onAutoUpdateStop()"
    ></cs-vm-logs>
  `,
})
export class VmLogsContainerComponent {
  readonly isAutoUpdateEnabled$ = this.store.pipe(
    select(fromVmLogsAutoUpdate.selectIsAutoUpdateEnabled),
  );
  readonly selectedVmId$ = this.store.pipe(
    select(fromVmLogs.filterSelectedVmId),
    debounceTime(0),
  );
  readonly newestFirst$ = this.store.pipe(
    select(fromVmLogs.filterNewestFirst),
    debounceTime(0),
  );

  constructor(private store: Store<State>) {}

  public onAutoUpdate() {
    this.store.dispatch(new vmLogsActions.EnableAutoUpdate());
  }

  public onAutoUpdateStop() {
    this.store.dispatch(new vmLogsActions.DisableAutoUpdate());
  }
}
