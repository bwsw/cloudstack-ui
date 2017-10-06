import { Component, Input, OnInit } from '@angular/core';
import { EditAccountConfigurationComponent } from './account-configuration/edit-account-configuration.component';
import { Configuration } from '../../../shared/models/configuration.model';
import { MdDialog } from '@angular/material';
import { ConfigurationService } from '../../../shared/services/configuration.service';
import { Account } from '../../../shared/models/account.model';

@Component({
  selector: 'cs-account-settings',
  templateUrl: 'account-settings.component.html'
})
export class AccountSettingsComponent implements OnInit {
  @Input() public account: Account;
  public configurations: Array<Configuration>;

  constructor(
    private dialog: MdDialog,
    private configurationService: ConfigurationService
  ) { }

  ngOnInit() {
    this.getConfiguration();
  }

  public getConfiguration() {
    this.configurationService.getList({ accountid: this.account.id })
      .subscribe(configurations => this.configurations = configurations);
  }

  public editConfiguration(configuration: Configuration): void {
    this.dialog.open(EditAccountConfigurationComponent, {
      width: '375px',
      data: {
        title: 'ACCOUNT_PAGE.CONFIGURATION.EDIT',
        configuration
      }
    })
      .afterClosed()
      .subscribe(configurationPair => {
        if (configurationPair) {
          this.configurationService.updateConfiguration(configurationPair, this.account)
            .subscribe(() => this.getConfiguration());
        }
      });
  }


}
