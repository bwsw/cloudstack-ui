import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChange,
  SimpleChanges
} from '@angular/core';
import * as cloneDeep from 'lodash/cloneDeep';


import { ResourceLimit, ResourceType } from '../../../shared/models';


@Component({
  selector: 'cs-account-limits',
  templateUrl: 'account-limits.component.html',
  styleUrls: ['account-limits.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AccountLimitsComponent implements  OnChanges {
  @Input() public limits: ResourceLimit[];
  @Input() public isAdmin: boolean;
  @Output() public limitsUpdate = new EventEmitter<ResourceLimit[]>();
  public isEdit = false;
  public localLimits: ResourceLimit[] = [];

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

  public ngOnChanges(changes: SimpleChanges) {
    const limits: SimpleChange = changes.limits;
    if (limits) {
      this.limits = limits.currentValue.map(this.setNoLimitToInfinity)
    }
  }

  public onSave(): void {
    const newLimits = this.localLimits.map(this.setInfinityToNoLimit);
    this.limitsUpdate.emit(newLimits);
    this.isEdit = false;
  }

  public editLimits() {
    this.localLimits = cloneDeep(this.limits);
    this.isEdit = !this.isEdit;
  }

  private setNoLimitToInfinity(limit: ResourceLimit) {
    if (limit.max !== -1) {
      return limit;
    }
    return {
      ...limit,
      max: Infinity
    };
  }

  private setInfinityToNoLimit(limit: ResourceLimit) {
    const max: number | string = limit.max as number | string;
    if (max !== Infinity && max !== 'Infinity') {
      return limit;
    }
    return {
      ...limit,
      max: -1
    };
  }
}
