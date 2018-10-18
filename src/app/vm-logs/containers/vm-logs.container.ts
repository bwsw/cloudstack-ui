import { Component } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { State } from '../../reducers';
import * as fromScrollVmLogs from '../redux/scroll-vm-logs.reducers';
import * as vmLogsActions from '../redux/vm-logs.actions';


@Component({
  selector: 'cs-vm-logs-table-container',
  template: `
    <cs-vm-logs
      [scroll]="scroll"
      (onScrollToggle)="onScrollToggle()"
    ></cs-vm-logs>`
})
export class VmLogsTableContainerComponent {
  readonly scroll$ = this.store.pipe(select(fromScrollVmLogs.selectScrollEnabled));

  public onScrollToggle() {
    this.store.dispatch(new vmLogsActions.Load);
  }

  constructor(
    private store: Store<State>,
  ) {
  }
}
