import { Component, Input, OnInit } from '@angular/core';
import { ResourceCount } from '../../../shared/models/resource-count.model';
import { Account } from '../../../shared/models/account.model';
import { ResourceCountService } from '../../../shared/services/resource-count.service';
import { DialogService } from '../../../dialog/dialog-service/dialog.service';

@Component({
  selector: 'cs-account-statistics',
  templateUrl: 'account-statistics.component.html'
})
export class AccountStatisticsComponent implements OnInit {
  @Input() public account: Account;
  public stats: Array<ResourceCount>;

  public resourceLabels = [
    'ACCOUNT_PAGE.CONFIGURATION.VM_COUNT',
    'ACCOUNT_PAGE.CONFIGURATION.IP_COUNT',
    'ACCOUNT_PAGE.CONFIGURATION.VOLUME_COUNT',
    'ACCOUNT_PAGE.CONFIGURATION.SNAPSHOT_COUNT',
    'ACCOUNT_PAGE.CONFIGURATION.TEMPLATE_COUNT',
    'ACCOUNT_PAGE.CONFIGURATION.PROJECT_COUNT',
    'ACCOUNT_PAGE.CONFIGURATION.NETWORK_COUNT',
    'ACCOUNT_PAGE.CONFIGURATION.VPC_COUNT',
    'ACCOUNT_PAGE.CONFIGURATION.CPU_COUNT',
    'ACCOUNT_PAGE.CONFIGURATION.MEMORY_COUNT',
    'ACCOUNT_PAGE.CONFIGURATION.PSTORAGE_COUNT',
    'ACCOUNT_PAGE.CONFIGURATION.SSTORAGE_COUNT',
  ];

  constructor(
    private resourceCountService: ResourceCountService,
    private dialogService: DialogService
  ) { }

  ngOnInit() {
    this.updateStats();
  }

  public updateStats(){
    this.resourceCountService.updateResourceCount(this.account)
            .subscribe(stats => this.stats = stats);
  }

  public confirmUpdateStats() {
    this.dialogService.confirm({
      message: 'ACCOUNT_PAGE.SIDEBAR.ARE_YOU_SURE_UPDATE_STATS'
    })
      .onErrorResumeNext()
      .subscribe(res => {
        if (res) {
          this.updateStats();
        }
      });
  }
}
