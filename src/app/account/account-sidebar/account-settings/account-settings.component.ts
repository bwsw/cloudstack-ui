import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Configuration } from '../../../shared/models/configuration.model';
import { Account } from '../../../shared/models/account.model';

@Component({
  selector: 'cs-account-settings',
  templateUrl: 'account-settings.component.html',
})
export class AccountSettingsComponent {
  @Input()
  public account: Account;
  @Input()
  public configurations: Configuration[];

  @Output()
  public configurationEdited = new EventEmitter();

  constructor() {}
}
