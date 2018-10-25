import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { take } from 'rxjs/operators';

import { State } from '../../reducers';
import { VirtualMachine } from '../shared/vm.model';
import * as vmActions from '../../reducers/vm/redux/vm.actions';
import * as fromVMs from '../../reducers/vm/redux/vm.reducers';

@Component({
  selector: 'cs-vm-sidebar-container',
  template: `
    <cs-vm-sidebar
      [entity]="vm$ | async"
      (colorChanged)="changeColor($event)"
    ></cs-vm-sidebar>`,
})
export class VmSidebarContainerComponent implements OnInit {
  readonly vm$ = this.store.pipe(select(fromVMs.getSelectedVM));

  constructor(private store: Store<State>, private activatedRoute: ActivatedRoute) {}

  public changeColor(color) {
    this.vm$.pipe(take(1)).subscribe((vm: VirtualMachine) => {
      this.store.dispatch(new vmActions.ChangeVmColor({ color, vm }));
    });
  }

  public ngOnInit() {
    const params = this.activatedRoute.snapshot.params;
    this.store.dispatch(new vmActions.LoadSelectedVM(params['id']));
  }
}
