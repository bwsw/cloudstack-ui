import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Configuration } from '../../../../shared/models/configuration.model';

@Component({
  selector: 'cs-account-configuration',
  templateUrl: 'account-configuration.component.html'
})
export class AccountConfigurationComponent {
  @Input() public configuration: Configuration;
  @Output() public onConfigurationEdit: EventEmitter<Configuration>;

  constructor() {
    this.onConfigurationEdit = new EventEmitter<Configuration>();
  }

  public edit(): void {
    this.onConfigurationEdit.emit(this.configuration);
  }

}
