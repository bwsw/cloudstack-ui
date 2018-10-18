import { Component, EventEmitter, Input, Output } from '@angular/core';
import { filter, onErrorResumeNext } from 'rxjs/operators';

import { ResourceCount } from '../../../shared/models/resource-count.model';
import { DialogService } from '../../../dialog/dialog-service/dialog.service';
import { ResourceType } from '../../../shared/models/resource-limit.model';

@Component({
  selector: 'cs-account-statistics',
  templateUrl: 'account-statistics.component.html',
})
export class AccountStatisticsComponent {
  @Input()
  public stats: ResourceCount[];
  @Output()
  public statisticsUpdate = new EventEmitter();

  public resourceLabels = {
    [ResourceType.Instance]: 'ACCOUNT_PAGE.CONFIGURATION.VM_COUNT',
    [ResourceType.IP]: 'ACCOUNT_PAGE.CONFIGURATION.IP_COUNT',
    [ResourceType.Volume]: 'ACCOUNT_PAGE.CONFIGURATION.VOLUME_COUNT',
    [ResourceType.Snapshot]: 'ACCOUNT_PAGE.CONFIGURATION.SNAPSHOT_COUNT',
    [ResourceType.Template]: 'ACCOUNT_PAGE.CONFIGURATION.TEMPLATE_COUNT',
    [ResourceType.Project]: 'ACCOUNT_PAGE.CONFIGURATION.PROJECT_COUNT',
    [ResourceType.Network]: 'ACCOUNT_PAGE.CONFIGURATION.NETWORK_COUNT',
    [ResourceType.VPC]: 'ACCOUNT_PAGE.CONFIGURATION.VPC_COUNT',
    [ResourceType.CPU]: 'ACCOUNT_PAGE.CONFIGURATION.CPU_COUNT',
    [ResourceType.Memory]: 'ACCOUNT_PAGE.CONFIGURATION.MEMORY_COUNT',
    [ResourceType.PrimaryStorage]: 'ACCOUNT_PAGE.CONFIGURATION.PSTORAGE_COUNT',
    [ResourceType.SecondaryStorage]: 'ACCOUNT_PAGE.CONFIGURATION.SSTORAGE_COUNT',
  };

  constructor(private dialogService: DialogService) {}

  public confirmUpdateStats() {
    this.dialogService
      .confirm({
        message: 'ACCOUNT_PAGE.SIDEBAR.ARE_YOU_SURE_UPDATE_STATS',
      })
      .pipe(
        onErrorResumeNext(),
        filter(Boolean),
      )
      .subscribe(res => this.statisticsUpdate.emit(res));
  }
}
