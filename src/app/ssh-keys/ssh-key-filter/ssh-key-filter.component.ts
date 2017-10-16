import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AuthService } from '../../shared/services/auth.service';


@Component({
  selector: 'cs-ssh-key-filter',
  templateUrl: 'ssh-key-filter.component.html'
})
export class ShhKeyFilterComponent {
  @Input() public accounts: Array<string>;
  @Input() public groupings: Array<any>;
  @Input() public selectedAccounts: Account[] = [];
  @Input() public selectedGroupings: Array<any> = [];
  @Output() public onGroupingsChange = new EventEmitter<any>();
  @Output() public onAccountsChange = new EventEmitter<any>();

  constructor(private authService: AuthService) {
  }

  public showAccountFilter(): boolean {
    return this.authService.isAdmin();
  }
}
