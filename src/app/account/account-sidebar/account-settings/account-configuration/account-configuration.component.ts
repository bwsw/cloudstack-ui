import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Configuration } from '../../../../shared/models/configuration.model';
import { EditAccountConfigurationComponent } from './edit-account-configuration.component';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'cs-account-configuration',
  templateUrl: 'account-configuration.component.html',
})
export class AccountConfigurationComponent {
  @Input()
  public configuration: Configuration;
  @Output()
  public configurationEdited: EventEmitter<Configuration>;

  constructor(private dialog: MatDialog) {
    this.configurationEdited = new EventEmitter<Configuration>();
  }

  public edit(): void {
    this.dialog
      .open(EditAccountConfigurationComponent, {
        width: '375px',
        data: {
          title: 'ACCOUNT_PAGE.CONFIGURATION.EDIT',
          configuration: this.configuration,
        },
      })
      .afterClosed()
      .subscribe(configurationPair => this.configurationEdited.emit(configurationPair));
  }
}
