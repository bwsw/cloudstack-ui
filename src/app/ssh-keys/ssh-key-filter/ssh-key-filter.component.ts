import {
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';
import { sshKeyGroupings } from '../containers/ssh-key-page/ssh-key-page.container';


@Component({
  selector: 'cs-ssh-key-filter',
  templateUrl: 'ssh-key-filter.component.html'
})
export class ShhKeyFilterComponent {
  @Input() public accounts: Array<Account>;
  @Input() public selectedAccountIds: Array<string> = [];
  @Input() public selectedGroupings: Array<any> = [];
  @Output() public onGroupingsChange = new EventEmitter<any>();
  @Output() public onAccountsChange = new EventEmitter<any>();

  readonly groupings = sshKeyGroupings;
}
