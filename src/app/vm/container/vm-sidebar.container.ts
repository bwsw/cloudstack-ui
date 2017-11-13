import {
  Component,
  OnInit
} from '@angular/core';
import { State } from '../../reducers/index';
import { Store } from '@ngrx/store';
import * as vmActions from '../../reducers/vm/redux/vm.actions';
import { ActivatedRoute } from '@angular/router';
import * as fromVMs from '../../reducers/vm/redux/vm.reducers';

@Component({
  selector: 'cs-vm-sidebar-container',
  template: `
    <cs-vm-sidebar
      [entity]="vm$ | async"
    ></cs-vm-sidebar>`
})
export class VmSidebarContainerComponent implements OnInit {

  readonly vm$ = this.store.select(fromVMs.getSelectedVM);


  constructor(
    private store: Store<State>,
    private activatedRoute: ActivatedRoute
  ) { }


  public ngOnInit() {
    const params = this.activatedRoute.snapshot.params;
    this.store.dispatch(new vmActions.LoadSelectedVM(params['id']));
  }

}
