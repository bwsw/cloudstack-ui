import { Component, Input } from '@angular/core';
import { Action, Store } from '@ngrx/store';
import { State } from '../../../root-store';
import { EntityAction } from '../../interfaces';

@Component({
  selector: 'cs-entity-action-menu-list',
  templateUrl: './entity-action-menu-list.component.html',
  styleUrls: ['./entity-action-menu-list.component.scss'],
})
export class EntityActionMenuListComponent {
  @Input()
  public actions: EntityAction[];

  constructor(private store: Store<State>) {}

  public onClick(actionCreator: () => Action) {
    this.store.dispatch(actionCreator());
  }
}
