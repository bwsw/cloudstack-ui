import {
  Component,
  OnInit,
  ViewChild
} from '@angular/core';
import {
  ActivatedRoute,
  Router
} from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { DialogService } from '../../dialog/dialog-service/dialog.service';
import {
  InstanceGroup,
  VmStatisticsComponent,
  Zone
} from '../../shared';
import { ListService } from '../../shared/components/list/list.service';
import { JobsNotificationService } from '../../shared/services/jobs-notification.service';
import { StatsUpdateService } from '../../shared/services/stats-update.service';
import { UserTagService } from '../../shared/services/tags/user-tag.service';
import { VmTagService } from '../../shared/services/tags/vm-tag.service';
import { ZoneService } from '../../shared/services/zone.service';
import { VmActionsService } from '../shared/vm-actions.service';
import {
  VirtualMachine,
  VmState
} from '../shared/vm.model';
import { VmService } from '../shared/vm.service';
import {
  InstanceGroupOrNoGroup,
  noGroup,
  VmFilter
} from '../vm-filter/vm-filter.component';
import { AuthService } from '../../shared/services/auth.service';
import { DomainService } from '../../shared/services/domain.service';
import { Domain } from '../../shared/models/domain.model';
import { Account } from '../../shared/models/account.model';
import { AccountService } from '../../shared/services/account.service';
import { VmListRowItemComponent } from '../vm-list-item/row-item/vm-list-row-item.component';
import { VmListCardItemComponent } from '../vm-list-item/card-item/vm-list-card-item.component';
import { ViewMode } from '../../shared/components/view-mode-switch/view-mode-switch.component';


@Component({
  selector: 'cs-vm-list',
  templateUrl: 'vm-list.component.html',
  styleUrls: ['vm-list.component.scss'],
  providers: [ListService]
})
export class VmListComponent implements OnInit {
  @ViewChild(VmStatisticsComponent) public vmStats: VmStatisticsComponent;

  public selectedGroupings = [];
  public groupings = [
    {
      key: 'zones',
      label: 'VM_PAGE.FILTERS.GROUP_BY_ZONES',
      selector: (item: VirtualMachine) => item.zoneId,
      name: (item: VirtualMachine) => item.zoneName
    },
    {
      key: 'groups',
      label: 'VM_PAGE.FILTERS.GROUP_BY_GROUPS',
      selector: (item: VirtualMachine) =>
        item.instanceGroup ? item.instanceGroup.name : noGroup,
      name: (item: VirtualMachine) =>
        item.instanceGroup ? item.instanceGroup.name : 'VM_PAGE.FILTERS.NO_GROUP'
    },
    {
      key: 'colors',
      label: 'VM_PAGE.FILTERS.GROUP_BY_COLORS',
      selector: (item: VirtualMachine) => this.vmTagService.getColorSync(item).value,
      name: (item: VirtualMachine) => ' ',
    },
    {
      key: 'accounts',
      label: 'VM_PAGE.FILTERS.GROUP_BY_ACCOUNTS',
      selector: (item: VirtualMachine) => item.account,
      name: (item: VirtualMachine) => `${this.getDomain(item.domainid)}${item.account}` || `${item.domain}/${item.account}`,
    }
  ];

  public mode: ViewMode;
  public key = 'vm-page';


  public groups: Array<InstanceGroup>;
  public zones: Array<Zone>;
  public accounts: Array<Account>;

  public vmList: Array<VirtualMachine>;
  public domainList: Array<Domain>;
  public visibleVmList: Array<VirtualMachine>;

  public inputs;
  public outputs;

  public filterData: any;
  public fetching = false;

  constructor(
    public listService: ListService,
    private vmService: VmService,
    private dialogService: DialogService,
    private jobsNotificationService: JobsNotificationService,
    private statsUpdateService: StatsUpdateService,
    private userTagService: UserTagService,
    private domainService: DomainService,
    private accountService: AccountService,
    private vmActionsService: VmActionsService,
    private vmTagService: VmTagService,
    private zoneService: ZoneService,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private router: Router
  ) {
    this.showDetail = this.showDetail.bind(this);

    this.inputs = {
      isSelected: item => this.listService.isSelected(item.id)
    };

    this.outputs = {
      onClick: this.showDetail
    };

    if (!this.authService.isAdmin()) {
      this.groupings = this.groupings.filter(g => g.key !== 'accounts');
      this.accounts = [];
    } else {
      this.getAccountList();
    }
  }

  public ngOnInit(): void {
    this.getVmList();
    this.resubscribeToJobs();
    this.subscribeToStatsUpdates();
    this.subscribeToVmUpdates();
  }

  public get noFilteringResults(): boolean {
    return !this.visibleVmList.length;
  }

  public get itemComponent() {
    return this.mode === ViewMode.BOX ? VmListCardItemComponent : VmListRowItemComponent;
  }

  public changeMode(mode) {
    this.mode = mode;
  }

  public updateFiltersAndFilter(filterData: VmFilter): void {
    this.filterData = filterData;
    this.filter();
  }

  public filter(): void {
    if (!this.vmList || !this.vmList.length) {
      return;
    }

    if (!this.filterData) {
      this.visibleVmList = this.vmList;
      return;
    }

    this.selectedGroupings = this.filterData.groupings.reduce((acc, g) => {
      acc.push(this.groupings.find(_ => _ === g));
      return acc;
    }, []);

    const { selectedZones, selectedGroups, selectedStates, accounts } = this.filterData;
    this.visibleVmList = this.filterVmsByZones(this.vmList, selectedZones);
    this.visibleVmList = this.filterVmsByGroup(this.visibleVmList, selectedGroups);
    this.visibleVmList = this.filterVMsByState(this.visibleVmList, selectedStates);
    this.visibleVmList = this.filterByAccount(this.visibleVmList, accounts);
    this.visibleVmList = this.sortByDate(this.visibleVmList);
  }

  public updateStats(): void {
    this.vmStats.updateStats();
  }

  public showDetail(vm: VirtualMachine): void {
    if (vm.state !== VmState.Error && vm.state !== VmState.Deploying) {
      this.listService.showDetails(vm.id);
    }
  }

  public showVmCreationDialog(): void {
    this.router.navigate(['./create'], {
      queryParamsHandling: 'preserve',
      relativeTo: this.activatedRoute
    });
  }

  private getVmList(): void {
    this.fetching = true;
    Observable.forkJoin(
      this.vmService.getListWithDetails(),
      this.vmService.getInstanceGroupList(),
      this.zoneService.getList()
    )
      .finally(() => this.fetching = false)
      .subscribe(([vmList, groups, zones]) => {
        this.vmList = this.sortByDate(vmList);
        this.visibleVmList = vmList;
        this.groups = groups;
        this.zones = zones;

        const selectedVmIsGone = this.visibleVmList.every(
          vm => !this.listService.isSelected(vm.id)
        );
        if (selectedVmIsGone) {
          this.listService.deselectItem();
        }

        if (this.shouldShowSuggestionDialog) {
          this.showSuggestionDialog();
        }
      });
  }

  private getAccountList() {
    Observable.forkJoin(
      this.accountService.getList(),
      this.domainService.getList()
    )
      .subscribe(([accounts, domains]) => {
        this.accounts = accounts;
        this.accounts.map(account => {
          account.fullDomain = domains.find(domain => domain.id === account.domainid).getPath();
          return account;
        });
        this.domainList = domains;
      });
  }

  private getDomain(domainId: string) {
    const domain = this.domainList && this.domainList.find(d => d.id === domainId);
    return domain ? domain.getPath() : '';
  }

  private subscribeToStatsUpdates(): void {
    this.statsUpdateService.subscribe(() => {
      this.updateStats();
    });
  }

  private subscribeToVmUpdates(): void {
    this.vmService.vmUpdateObservable.subscribe(updatedVM => {
      if (!!updatedVM) {
        this.vmService.getWithDetails(updatedVM.id).subscribe(vm => {
          this.replaceVmInList(vm);
          this.filter();
        });
      } else {
        this.getVmList();
      }
      this.updateStats();
    });
  }

  private replaceVmInList(vm: VirtualMachine): void {
    if (!this.vmList) {
      return;
    }

    const index = this.vmList.findIndex(_ => _.id === vm.id);

    if (index < 0) {
      this.vmList.push(vm);
    } else {
      this.vmList = [
        ...this.vmList.slice(0, index),
        vm,
        ...this.vmList.slice(index + 1)
      ];
    }
  }

  private resubscribeToJobs(): void {
    this.vmService.resubscribe().subscribe(observables => {
      observables.forEach(observable => {
        observable.subscribe(job => {
          const action = this.vmActionsService.getActionByName(job.cmd as any);
          if (action) {
            this.jobsNotificationService.finish({
              message: action.tokens.successMessage
            });
          }
        });
      });
    });
  }

  private get shouldShowSuggestionDialog(): boolean {
    return !this.vmList.length && !this.isCreateVmInUrl;
  }

  private get isCreateVmInUrl(): boolean {
    return (
      this.activatedRoute.children.length &&
      this.activatedRoute.children[0].snapshot.url[0].path === 'create'
    );
  }

  private showSuggestionDialog(): void {
    this.userTagService.getAskToCreateVm().subscribe(tag => {
      if (tag === false) {
        return;
      }

      this.dialogService.askDialog({
        message: 'SUGGESTION_DIALOG.WOULD_YOU_LIKE_TO_CREATE_VM',
        actions: [
          {
            handler: () => this.showVmCreationDialog(),
            text: 'COMMON.YES'
          },
          {
            text: 'COMMON.NO'
          },
          {
            handler: () => this.userTagService.setAskToCreateVm(false).subscribe(),
            text: 'SUGGESTION_DIALOG.NO_DONT_ASK'
          }
        ],
        disableClose: false,
        width: '320px'
      });
    });
  }

  private filterVmsByGroup(
    vmList: Array<VirtualMachine>,
    groups: Array<InstanceGroupOrNoGroup>
  ): Array<VirtualMachine> {
    if (!groups.length) {
      return vmList;
    }
    return vmList.filter(
      vm =>
        (!vm.instanceGroup && groups.includes(noGroup)) ||
        (vm.instanceGroup &&
          groups.some(g => vm.instanceGroup.name === (g as InstanceGroup).name))
    );
  }

  private filterVmsByZones(
    vmList: Array<VirtualMachine>,
    zones: Array<Zone>
  ): Array<VirtualMachine> {
    return !zones.length
      ? vmList
      : vmList.filter(vm => zones.some(z => vm.zoneId === z.id));
  }

  private filterVMsByState(
    vmList: Array<VirtualMachine>,
    states
  ): Array<VirtualMachine> {
    return !states.length ? vmList : vmList.filter(vm => states.includes(vm.state));
  }

  private filterByAccount(vmList: Array<VirtualMachine>, accounts = []) {
    return !accounts.length
      ? vmList
      : vmList.filter(vm => accounts.find(
        account => account.name === vm.account && account.domainid === vm.domainid));
  }

  private sortByDate(vmList: Array<VirtualMachine>): Array<VirtualMachine> {
    return vmList.sort((vmA, vmB) => {
      const vmACreated = vmA.created;
      const vmBCreated = vmB.created;

      if (vmACreated > vmBCreated) {
        return 1;
      }
      if (vmACreated < vmBCreated) {
        return -1;
      }
      return 0;
    });
  }
}
