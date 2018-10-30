import { Component } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { State } from '../../reducers';
import * as fromVmLogs from '../redux/vm-logs.reducers';

@Component({
  selector: 'cs-vm-logs-table-container',
  template: `
    <cs-vm-logs-table
      *loading="loading$ | async"
      [vmLogs]="vmLogs$ | async"
    ></cs-vm-logs-table>`,
})
export class VmLogsTableContainerComponent {
  readonly loading$ = this.store.pipe(select(fromVmLogs.isLoading));
  readonly vmLogs$ = this.store.pipe(select(fromVmLogs.selectAll));

  constructor(private store: Store<State>) {}
}
