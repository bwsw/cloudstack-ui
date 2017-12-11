import {
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';
import { Grouping } from '../../shared/models/grouping.model';


@Component({
  selector: 'cs-ssh-key-filter',
  templateUrl: 'ssh-key-filter.component.html'
})
export class ShhKeyFilterComponent {
  @Input() public accounts: Array<Account>;
  @Input() public selectedAccountIds: Array<string> = [];
  @Input() public selectedGroupings: Array<Grouping> = [];
  @Input() public groupings: Array<Grouping>;
  @Output() public onGroupingsChange = new EventEmitter<Array<Grouping>>();
  @Output() public onAccountsChange = new EventEmitter<Array<string>>();
}
