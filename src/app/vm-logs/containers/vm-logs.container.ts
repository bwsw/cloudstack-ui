import { Component } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { State } from '../../reducers';
import * as fromVmLogsAutoUpdate from '../redux/vm-logs-auto-update.reducers';
import * as fromVmLogsVm from '../redux/vm-logs-vm.reducers';
import * as vmLogsActions from '../redux/vm-logs.actions';
import { debounceTime } from 'rxjs/internal/operators';


@Component({
  selector: 'cs-vm-logs-container',
  template: `
    <cs-vm-logs
      [isAutoUpdateEnabled]="isAutoUpdateEnabled$ | async"
      [selectedVmId]="selectedVmId$ | async"
      (onAutoUpdate)="onAutoUpdate()"
      (onAutoUpdateStop)="onAutoUpdateStop()"
    ></cs-vm-logs>
  `
})
export class VmLogsContainerComponent {
  readonly isAutoUpdateEnabled$ = this.store.pipe(select(fromVmLogsAutoUpdate.selectIsAutoUpdateEnabled));
  readonly selectedVmId$ = this.store.pipe(
    select(fromVmLogsVm.filterSelectedVmId),
    debounceTime(0)
  );

  public onAutoUpdate() {
    this.store.dispatch(new vmLogsActions.EnableAutoUpdate());
  }

  public onAutoUpdateStop() {
    this.store.dispatch(new vmLogsActions.DisableAutoUpdate());
  }

  constructor(private store: Store<State>) {}
}
