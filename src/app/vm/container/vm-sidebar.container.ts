import {
  Component,
  OnInit
} from '@angular/core';
import { State } from '../../reducers/index';
import { Store } from '@ngrx/store';
import * as vmActions from '../../reducers/vm/redux/vm.actions';
import { ActivatedRoute } from '@angular/router';
import * as fromVMs from '../../reducers/vm/redux/vm.reducers';
import { VirtualMachine } from '../shared/vm.model';
import { WithUnsubscribe } from '../../utils/mixins/with-unsubscribe';

@Component({
  selector: 'cs-vm-sidebar-container',
  template: `
    <cs-vm-sidebar
      [entity]="vm$ | async"
      (onColorChange)="changeColor($event)"
    ></cs-vm-sidebar>`
})
export class VmSidebarContainerComponent extends WithUnsubscribe() implements OnInit {

  readonly vm$ = this.store.select(fromVMs.getSelectedVM);
  public vm: VirtualMachine;

  constructor(
    private store: Store<State>,
    private activatedRoute: ActivatedRoute
  ) {
    super();
  }

  public changeColor(color) {
    this.store.dispatch(new vmActions.ChangeVmColor({
      color,
      vm: this.vm
    }));
  }


  public ngOnInit() {
    const params = this.activatedRoute.snapshot.params;
    this.store.dispatch(new vmActions.LoadSelectedVM(params['id']));
    this.vm$
      .takeUntil(this.unsubscribe$)
      .subscribe(vm => {
        if (vm) {
          this.vm = new VirtualMachine(vm);
        }
      });
  }

}
