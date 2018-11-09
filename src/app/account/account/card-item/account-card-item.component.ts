import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material';
import { Account } from '../../../shared/models/account.model';
import { AccountItemComponent } from '../account-item.component';
import { AuthService } from '../../../shared/services/auth.service';

@Component({
  selector: 'cs-account-card-item',
  templateUrl: 'account-card-item.component.html',
  styleUrls: ['account-card-item.component.scss'],
})
export class AccountCardItemComponent extends AccountItemComponent {
  @Input()
  public item: Account;
  @Input()
  public isSelected: (account) => boolean;
  // tslint:disable-next-line:no-output-on-prefix
  @Output()
  public onClick = new EventEmitter<Account>();
  @ViewChild(MatMenuTrigger)
  public matMenuTrigger: MatMenuTrigger;

  constructor(protected authService: AuthService) {
    super(authService);
  }
}
