import {
  Component,
  Input,
  Type
} from '@angular/core';
import { BaseGroupedComponent } from './base-grouped.component';

@Component({
  selector: 'cs-grouped-card',
  templateUrl: 'grouped-card.component.html',
  styleUrls: ['grouped.component.scss']
})
export class GroupedCardComponent extends BaseGroupedComponent {
  @Input() public component: Type<any>;
  @Input() public list: Array<any>;
  @Input() public level = 0;
  @Input() public groupings: Array<any>;
  @Input() dynamicInputs: { [k: string]: any } = {};
  @Input() dynamicOutputs: { [k: string]: Function } = {};

}
