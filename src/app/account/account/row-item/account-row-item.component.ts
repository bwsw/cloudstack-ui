import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild
} from '@angular/core';
import { MatMenuTrigger } from '@angular/material';
import { Account } from '../../../shared/models/account.model';
import { AccountItemComponent } from '../account-item.component';
import { AuthService } from '../../../shared/services/auth.service';

@Component({
  selector: 'cs-account-row-item',
  templateUrl: 'account-row-item.component.html',
  styleUrls: ['account-row-item.component.scss']
})
export class AccountRowItemComponent extends AccountItemComponent {
  @Input() public item: Account;
  @Input() public isSelected: (account) => boolean;
  @Output() public onClick = new EventEmitter<Account>();
  @Output() public onAccountChanged = new EventEmitter<Account>();
  @ViewChild(MatMenuTrigger) public matMenuTrigger: MatMenuTrigger;

  constructor(protected authService: AuthService) {
    super(authService);
  }
}
