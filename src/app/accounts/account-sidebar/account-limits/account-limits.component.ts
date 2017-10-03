import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ResourceLimit } from '../../../shared/models/resource-limit.model';


@Component({
  selector: 'cs-account-limits',
  templateUrl: 'account-limits.component.html'
})
export class AccountLimitsComponent {
  @Input() public limits: Array<ResourceLimit>;
  @Output() public onLimitsEdit: EventEmitter<Array<ResourceLimit>>;
  public isEdit: boolean = false;

  public limitLabels = [
    'ACCOUNT_PAGE.CONFIGURATION.VM_LIMIT',
    'ACCOUNT_PAGE.CONFIGURATION.IP_LIMIT',
    'ACCOUNT_PAGE.CONFIGURATION.VOLUME_LIMIT',
    'ACCOUNT_PAGE.CONFIGURATION.SNAPSHOT_LIMIT',
    'ACCOUNT_PAGE.CONFIGURATION.TEMPLATE_LIMIT',
    'ACCOUNT_PAGE.CONFIGURATION.PROJECT_LIMIT',
    'ACCOUNT_PAGE.CONFIGURATION.NETWORK_LIMIT',
    'ACCOUNT_PAGE.CONFIGURATION.VPC_LIMIT',
    'ACCOUNT_PAGE.CONFIGURATION.CPU_LIMIT',
    'ACCOUNT_PAGE.CONFIGURATION.MEMORY_LIMIT',
    'ACCOUNT_PAGE.CONFIGURATION.PSTORAGE_LIMIT',
    'ACCOUNT_PAGE.CONFIGURATION.SSTORAGE_LIMIT',
  ];

  constructor() {
    this.onLimitsEdit = new EventEmitter<Array<ResourceLimit>>();
  }

  public onSave(): void {
    this.onLimitsEdit.emit(this.limits);
    this.isEdit = false;
  }

}
