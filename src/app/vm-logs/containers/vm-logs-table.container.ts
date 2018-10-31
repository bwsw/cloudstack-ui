import { Component } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { State } from '../../reducers';
import * as fromVmLogs from '../redux/vm-logs.reducers';
import { map } from 'rxjs/operators';
import * as vmLogsActions from '../redux/vm-logs.actions';

@Component({
  selector: 'cs-vm-logs-table-container',
  template: `
    <cs-vm-logs-table
      *loading="loading$ | async"
      [vmLogs]="vmLogs$ | async"
      [enableShowMore]="enableShowMore$ | async"
      (showMoreClicked)="onShowMore()"
    ></cs-vm-logs-table>`,
})
export class VmLogsTableContainerComponent {
  readonly loading$ = this.store.pipe(select(fromVmLogs.isLoading));
  readonly vmLogs$ = this.store.pipe(select(fromVmLogs.selectScrolledLogs));
  readonly enableShowMore$ = this.store.pipe(
    select(fromVmLogs.selectAreAllLogsShown),
    map(areAllLogsShown => !areAllLogsShown),
  );

  constructor(private store: Store<State>) {}

  public onShowMore() {
    this.store.dispatch(new vmLogsActions.ScrollVmLogs());
  }
}
