import { Component } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { State } from '../../reducers';
import * as fromScrollVmLogs from '../redux/scroll-vm-logs.reducers';
import * as fromVmLogs from '../redux/vm-logs.reducers';
import * as vmLogsActions from '../redux/vm-logs.actions';


@Component({
  selector: 'cs-vm-logs-container',
  template: `
    <cs-vm-logs
      [scroll]="scroll$ | async"
      [selectedVmId]="selectedVmId$ | async"
      (onScroll)="onScroll()"
      (onScrollStop)="onScrollStop()"
    ></cs-vm-logs>
  `
})
export class VmLogsContainerComponent {
  readonly scroll$ = this.store.pipe(select(fromScrollVmLogs.selectScrollEnabled));
  readonly selectedVmId$ = this.store.pipe(select(fromVmLogs.filterSelectedVmId));

  public onScroll() {
    this.store.dispatch(new vmLogsActions.ScrollVmLogs());
  }

  public onScrollStop() {
    this.store.dispatch(new vmLogsActions.StopScrollVmLogs());
  }

  constructor(
    private store: Store<State>,
  ) {
  }
}
