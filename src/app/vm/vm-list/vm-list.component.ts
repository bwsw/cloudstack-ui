import { Component, HostBinding, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { DialogService } from '../../dialog/dialog-module/dialog.service';
import { AsyncJob, InstanceGroup, VmStatisticsComponent, Zone } from '../../shared';
import { ListService } from '../../shared/components/list/list.service';
import { AsyncJobService } from '../../shared/services/async-job.service';
import { JobsNotificationService } from '../../shared/services/jobs-notification.service';
import { StatsUpdateService } from '../../shared/services/stats-update.service';
import { UserTagService } from '../../shared/services/tags/user-tag.service';
import { VmTagService } from '../../shared/services/tags/vm-tag.service';
import { ZoneService } from '../../shared/services/zone.service';
import { VmActionsService } from '../shared/vm-actions.service';
import { VirtualMachine, VmState } from '../shared/vm.model';
import { ActivatedRoute, Router } from '@angular/router';
import { VirtualMachineEntityName, VmService } from '../shared/vm.service';
import { InstanceGroupOrNoGroup, noGroup, VmFilter } from '../vm-filter/vm-filter.component';
import { VmListItemComponent } from './vm-list-item.component';
import * as clone from 'lodash/clone';


@Component({
  selector: 'cs-vm-list',
  templateUrl: 'vm-list.component.html',
  providers: [ListService]
})
export class VmListComponent implements OnInit {
  @ViewChild(VmStatisticsComponent) public vmStats: VmStatisticsComponent;
  @HostBinding('class.mdl-color--grey-100') public backgroundColorClass = true;
  @HostBinding('class.detail-list-container') public detailListContainer = true;

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
    }
  ];

  public VmListItemComponent = VmListItemComponent;

  public groups: Array<InstanceGroup>;
  public zones: Array<Zone>;

  public vmList: Array<VirtualMachine>;
  public visibleVmList: Array<VirtualMachine>;

  public inputs;
  public outputs;

  public filterData: any;

  constructor(
    public listService: ListService,
    private vmService: VmService,
    private dialogService: DialogService,
    private jobsNotificationService: JobsNotificationService,
    private asyncJobService: AsyncJobService,
    private statsUpdateService: StatsUpdateService,
    private userTagService: UserTagService,
    private vmActionsService: VmActionsService,
    private vmTagService: VmTagService,
    private zoneService: ZoneService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {
    this.showDetail = this.showDetail.bind(this);

    this.inputs = {
      isSelected: (item) => this.listService.isSelected(item.id)
    };

    this.outputs = {
      onClick: this.showDetail
    };
  }

  public ngOnInit(): void {
    this.getVmList();
    this.resubscribeToJobs();
    this.subscribeToStatsUpdates();
    this.subscribeToVmUpdates();
    this.subscribeToVmDestroyed();
    this.subscribeToAsyncJobUpdates();
  }

  public get noFilteringResults(): boolean {
    return !this.visibleVmList.length;
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

    const { selectedZones, selectedGroups, selectedStates } = this.filterData;
    this.visibleVmList = this.filterVmsByZones(this.vmList, selectedZones);
    this.visibleVmList = this.filterVmsByGroup(this.visibleVmList, selectedGroups);
    this.visibleVmList = this.filterVMsByState(this.visibleVmList, selectedStates);
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
      preserveQueryParams: true,
      relativeTo: this.activatedRoute
    });
  }

  private getVmList(): void {
    Observable.forkJoin(
      this.vmService.getListWithDetails(),
      this.vmService.getInstanceGroupList(),
      this.zoneService.getList()
    )
      .subscribe(([vmList, groups, zones]) => {
        this.vmList = this.sortByDate(vmList);
        this.visibleVmList = vmList;
        this.groups = groups;
        this.zones = zones;

        if (!this.vmList.length) {
          this.showSuggestionDialog();
        }
      });
  }

  private subscribeToStatsUpdates(): void {
    this.statsUpdateService.subscribe(() => {
      this.updateStats();
    });
  }

  private subscribeToVmUpdates(): void {
    this.vmService.vmUpdateObservable
      .switchMap(updatedVM =>
        this.vmService.getWithDetails(updatedVM.id)
      )
      .subscribe(vm => {
        this.replaceVmInList(vm);
        this.filter();
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
        ...this.vmList.slice(index + 1),
      ];
    }
  }

  private resubscribeToJobs(): void {
    this.vmService.resubscribe()
      .subscribe(observables => {
        observables.forEach(observable => {
          observable.subscribe(job => {
            const action = this.vmActionsService.getActionByName(job.cmd as any);
            this.jobsNotificationService.finish({
              message: action.tokens.successMessage
            });
          });
        });
      });
  }

  private subscribeToVmDestroyed(): void {
    this.asyncJobService.event
      .filter(job => this.isAsyncJobAVirtualMachineJobWithResult(job))
      .filter(job => job.result.state === VmState.Destroyed || job.result.state === VmState.Expunging)
      .subscribe((job: AsyncJob<any>) => {
        this.vmList = this.vmList.filter(vm => vm.id !== job.result.id);
        if (this.listService.isSelected(job.result.id)) {
          this.listService.deselectItem();
        }
        this.filter();
        this.updateStats();
      });
  }

  private subscribeToAsyncJobUpdates(): void {
    this.asyncJobService.event
      .filter(job => this.isAsyncJobAVirtualMachineJobWithResult(job))
      .subscribe(job => {
        this.updateVmInListWithAsyncJobResult(job);
      });
  }

  private updateVmInListWithAsyncJobResult(job: AsyncJob<any>): void {
    const vm = this.vmList.find(listVm => {
      return job.result.id === listVm.id;
    });

    if (vm) {
      // todo: may be we need to update more params
      // todo: need to discuss

      const newVm = clone(vm);

      newVm.state = job.result.state;
      if (job.result.nic && job.result.nic.length) {
        newVm.nic[0] = job.result.nic[0];
      }

      this.vmList = this.vmList.map(listVm => {
        if (listVm.id === newVm.id) {
          return newVm;
        } else {
          return listVm;
        }
      });

      this.filter();
      this.updateStats();
    }
  }

  private showSuggestionDialog(): void {
    this.userTagService.getAskToCreateVm()
      .subscribe(tag => {
        if (tag === false) {
          return;
        }

        this.dialogService.showDialog({
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
          fullWidthAction: true,
          isModal: true,
          clickOutsideToClose: true,
          styles: { 'width': '320px' }
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

  private filterVmsByZones(vmList: Array<VirtualMachine>, zones: Array<Zone>): Array<VirtualMachine> {
    return !zones.length
      ? vmList
      : vmList.filter(vm => zones.some(z => vm.zoneId === z.id));
  }

  private filterVMsByState(vmList: Array<VirtualMachine>, states): Array<VirtualMachine> {
    return !states.length
      ? vmList
      : vmList.filter(vm => states.includes(vm.state));
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

  private isAsyncJobAVirtualMachineJobWithResult(job: AsyncJob<any>): boolean {
    // instanceof check is needed because API response for
    // VM restore doesn't contain the instanceType field

    return (
      job.result &&
      (job.instanceType === VirtualMachineEntityName ||
        job.result instanceof VirtualMachine)
    );
  }
}
