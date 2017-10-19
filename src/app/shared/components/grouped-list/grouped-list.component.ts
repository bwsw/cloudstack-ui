import {
  Component,
  Input,
  Type
} from '@angular/core';
import { BaseGroupedComponent } from './base-grouped.component';

@Component({
  selector: 'cs-grouped-list',
  templateUrl: 'grouped-list.component.html',
  styleUrls: ['grouped.component.scss']
})
export class GroupedListComponent extends BaseGroupedComponent {
  @Input() public component: Type<any>;
  @Input() public list: Array<any>;
  @Input() public level = 0;
  @Input() public groupings: Array<any>;
  @Input() dynamicInputs: { [k: string]: any } = {};
  @Input() dynamicOutputs: { [k: string]: Function } = {};

}
