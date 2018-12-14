import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Action, Store } from '@ngrx/store';
import { State } from '../../../root-store';
import { EntityAction } from '../../interfaces';

@Component({
  selector: 'cs-entity-action-row',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './entity-action-row.component.html',
  styleUrls: ['./entity-action-row.component.scss'],
})
export class EntityActionRowComponent {
  @Input()
  public actions: EntityAction[];

  constructor(private store: Store<State>) {}

  public onClick(actionCreator: () => Action) {
    this.store.dispatch(actionCreator());
  }
}
