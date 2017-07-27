import { Component, HostBinding, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { DialogService } from '../../dialog/dialog-module/dialog.service';

import {
  AsyncJob,
  AsyncJobService,
  InstanceGroup,
  JobsNotificationService,
  StatsUpdateService,
  VmStatisticsComponent,
  Zone
} from '../../shared';

import { ListService } from '../../shared/components/list/list.service';
import { UserService } from '../../shared/services/user.service';
import { ZoneService } from '../../shared/services/zone.service';
import { VirtualMachine, VmActions, VmStates } from '../shared/vm.model';

import { IVmActionEvent, VirtualMachineEntityName, VmService } from '../shared/vm.service';

import { VmCreationComponent } from '../vm-creation/vm-creation.component';
import { InstanceGroupOrNoGroup, noGroup, VmFilter } from '../vm-filter/vm-filter.component';
import { VmListItemComponent } from './vm-list-item.component';


const askToCreateVm = 'askToCreateVm';

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
      label: 'GROUP_BY.ZONES',
      selector: (item: VirtualMachine) => item.zoneId,
      name: (item: VirtualMachine) => item.zoneName
    },
    {
      key: 'groups',
      label: 'GROUP_BY.GROUPS',
      selector: (item: VirtualMachine) =>
        item.instanceGroup ? item.instanceGroup.name : noGroup,
      name: (item: VirtualMachine) =>
        item.instanceGroup ? item.instanceGroup.name : 'NO_GROUP'
    },
    {
      key: 'colors',
      label: 'GROUP_BY.COLORS',
      selector: (item: VirtualMachine) => item.getColor().value,
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

  constructor(
    public listService: ListService,
    private vmService: VmService,
    private dialogService: DialogService,
    private jobsNotificationService: JobsNotificationService,
    private asyncJobService: AsyncJobService,
    private statsUpdateService: StatsUpdateService,
    private userService: UserService,
    private zoneService: ZoneService
  ) {
    this.showDetail = this.showDetail.bind(this);
    this.vmAction = this.vmAction.bind(this);

    this.inputs = {
      isSelected: (item) => this.listService.isSelected(item.id)
    };

    this.outputs = {
      onVmAction: this.vmAction,
      onClick: this.showDetail
    };
  }

  public ngOnInit(): void {
    this.getVmList();
    this.resubscribeToJobs();
    this.subscribeToStatsUpdates();
    this.subscribeToVmUpdates();
    this.subscribeToVmDestroyed();
    this.subscribeToVmCreationDialog();
    this.asyncJobService.event
      .filter(j => j.instanceType === VirtualMachineEntityName)
      .filter(j => j.result)
      .subscribe((job: AsyncJob<any>) => {
        const index = this.vmList.findIndex(_ => job.result.id === _.id);
        if (index > -1) {
          // todo: may be we need to update more params
          // todo: need to discuss
          this.vmList[index].state = job.result.state;
          if (job.result.nic && job.result.nic.length) {
            this.vmList[index].nic[0] = job.result.nic[0];
          }
        }
      });
  }

  public get noFilteringResults(): boolean {
    return !this.visibleVmList.length;
  }

  public updateFilters(filterData?: VmFilter): void {
    if (!this.vmList.length || !filterData) {
      this.visibleVmList = this.vmList;
      return;
    }

    this.selectedGroupings = filterData.groupings.reduce((acc, g) => {
      acc.push(this.groupings.find(_ => _ === g));
      return acc;
    }, []);

    const { selectedZones, selectedGroups, selectedStates } = filterData;
    this.visibleVmList = this.filterVmsByZones(this.vmList, selectedZones);
    this.visibleVmList = this.filterVmsByGroup(this.visibleVmList, selectedGroups);
    this.visibleVmList = this.filterVMsByState(this.visibleVmList, selectedStates);
    this.visibleVmList = this.sortByDate(this.visibleVmList);
  }

  public updateStats(): void {
    this.vmStats.updateStats();
  }

  public vmAction(e: IVmActionEvent): void {
    let dialog;
    if (e.action.commandName === VmActions.RESET_PASSWORD) {
      dialog = this.dialogService.customConfirm({
        message: e.action.confirmMessage,
        width: '400px'
      });
    } else {
      dialog = this.dialogService.confirm(e.action.confirmMessage, 'NO', 'YES');
    }

    dialog.onErrorResumeNext()
      .switchMap(() => this.vmService.vmAction(e))
      .subscribe(
        () => {
        },
        error => this.dialogService.alert(error.message)
      );
  }

  public onVmCreated(vm: VirtualMachine): void {
    this.vmList.push(vm);
    this.updateFilters();
    this.updateStats();
  }

  public showDetail(vm: VirtualMachine): void {
    if (vm.state !== VmStates.Error && vm.state !== VmStates.Deploying) {
      this.listService.showDetails(vm.id);
    }
  }

  public showVmCreationDialog(): void {
    this.dialogService.showCustomDialog({
      component: VmCreationComponent,
      clickOutsideToClose: false,
      styles: { 'width': '755px', 'padding': '0' },
    })
      .switchMap(res => res.onHide())
      .subscribe(vm => {
        if (vm) {
          this.onVmCreated(vm);
        }
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
      .subscribe((updatedVM) => {
        const index = this.vmList.findIndex(_ => _.id === updatedVM.id);
        if (index < 0) {
          return;
        }
        this.vmService.getWithDetails(updatedVM.id).subscribe((vm) => {
          this.vmList = [
            ...this.vmList.slice(0, index),
            vm,
            ...this.vmList.slice(index + 1),
          ];
          this.updateFilters();
        });
        this.updateStats();
      });
  }

  private resubscribeToJobs(): void {
    this.vmService.resubscribe()
      .subscribe(observables => {
        observables.forEach(observable => {
          observable.subscribe(job => {
            const action = VirtualMachine.getAction(job.cmd);
            this.jobsNotificationService.finish({ message: action.successMessage });
          });
        });
      });
  }

  private subscribeToVmDestroyed(): void {
    this.asyncJobService.event
      .filter(j => j.instanceType === VirtualMachineEntityName)
      .filter(j => j.result)
      .filter(j => j.result.state === VmStates.Destroyed || j.result.state === VmStates.Expunging)
      .subscribe((job: AsyncJob<any>) => {
        this.vmList = this.vmList.filter(vm => vm.id !== job.result.id);
        if (this.listService.isSelected(job.result.id)) {
          this.listService.deselectItem();
        }
        this.updateFilters();
        this.updateStats();
      });
  }

  private subscribeToVmCreationDialog(): void {
    this.listService.onAction.subscribe(() => this.showVmCreationDialog());
  }

  private showSuggestionDialog(): void {
    this.userService.readTag(askToCreateVm)
      .subscribe(tag => {
        if (tag === 'false') {
          return;
        }

        this.dialogService.showDialog({
          message: 'WOULD_YOU_LIKE_TO_CREATE_VM',
          actions: [
            {
              handler: () => this.showVmCreationDialog(),
              text: 'YES'
            },
            { text: 'NO' },
            {
              handler: () => this.userService.writeTag(askToCreateVm, 'false').subscribe(),
              text: 'NO_DONT_ASK'
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
}
