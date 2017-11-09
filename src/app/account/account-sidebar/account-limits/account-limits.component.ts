import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';
import {
  ResourceLimit,
  ResourceType
} from '../../../shared/models/resource-limit.model';


@Component({
  selector: 'cs-account-limits',
  templateUrl: 'account-limits.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['account-limits.component.scss']
})
export class AccountLimitsComponent {
  @Input() public limits: Array<ResourceLimit>;
  @Input() public isAdmin: boolean;
  @Output() public onLimitsEdit: EventEmitter<Array<ResourceLimit>>;
  public isEdit: boolean = false;

  public localLimits = [];

  public limitLabels = {
    [ResourceType.Instance]: 'ACCOUNT_PAGE.CONFIGURATION.VM_LIMIT',
    [ResourceType.IP]: 'ACCOUNT_PAGE.CONFIGURATION.IP_LIMIT',
    [ResourceType.Volume]: 'ACCOUNT_PAGE.CONFIGURATION.VOLUME_LIMIT',
    [ResourceType.Snapshot]: 'ACCOUNT_PAGE.CONFIGURATION.SNAPSHOT_LIMIT',
    [ResourceType.Template]: 'ACCOUNT_PAGE.CONFIGURATION.TEMPLATE_LIMIT',
    [ResourceType.Project]: 'ACCOUNT_PAGE.CONFIGURATION.PROJECT_LIMIT',
    [ResourceType.Network]: 'ACCOUNT_PAGE.CONFIGURATION.NETWORK_LIMIT',
    [ResourceType.VPC]: 'ACCOUNT_PAGE.CONFIGURATION.VPC_LIMIT',
    [ResourceType.CPU]: 'ACCOUNT_PAGE.CONFIGURATION.CPU_LIMIT',
    [ResourceType.Memory]: 'ACCOUNT_PAGE.CONFIGURATION.MEMORY_LIMIT',
    [ResourceType.PrimaryStorage]: 'ACCOUNT_PAGE.CONFIGURATION.PSTORAGE_LIMIT',
    [ResourceType.SecondaryStorage]: 'ACCOUNT_PAGE.CONFIGURATION.SSTORAGE_LIMIT',
  };

  constructor() {
    this.onLimitsEdit = new EventEmitter<Array<ResourceLimit>>();
  }

  public onSave(): void {
    this.onLimitsEdit.emit(this.localLimits);
    this.isEdit = false;
  }

  public editLimits() {
    this.localLimits =  Object.assign([], this.limits.map(
      limit => ({resourcetype: limit.resourcetype, max: limit.max})));
    this.isEdit = !this.isEdit;
  }

}
