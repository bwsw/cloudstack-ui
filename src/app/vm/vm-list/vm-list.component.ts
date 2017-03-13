import { Component,
  OnInit,
  Inject,
  ViewChild,
  HostBinding
} from '@angular/core';

import { VmService, IVmActionEvent } from '../shared/vm.service';
import { VirtualMachine } from '../shared/vm.model';
import { MdlDialogService } from 'angular2-mdl';
import { TranslateService } from 'ng2-translate';
import {
  AsyncJobService,
  IAsyncJob,
  INotificationStatus,
  IStorageService,
  InstanceGroup,
  JobsNotificationService,
  ServiceOfferingService,
  StatsUpdateService,
  Zone
} from '../../shared';

import { VmCreationComponent } from '../vm-creation/vm-creation.component';
import { VmFilter } from '../vm-filter/vm-filter.component';
import { VmListSection } from './vm-list-section/vm-list-section.component';
import { VmListSubsection } from './vm-list-subsection/vm-list-subsection.component';
import { VmStatisticsComponent } from '../../shared/components/vm-statistics/vm-statistics.component';


export const enum SectionType {
  zone,
  group
}

const askToCreateVm = 'askToCreateVm';

@Component({
  selector: 'cs-vm-list',
  templateUrl: 'vm-list.component.html',
  styleUrls: ['vm-list.component.scss']
})
export class VmListComponent implements OnInit {
  @ViewChild(VmStatisticsComponent) public vmStats: VmStatisticsComponent;
  @ViewChild(VmCreationComponent) public vmCreationForm: VmCreationComponent;
  @HostBinding('class.mdl-color--grey-100') public backgroundColorClass = true;
  @HostBinding('class.detail-list-container') public detailListContainer = true;

  public isDetailOpen: boolean;

  public groupByColors = false;

  public selectedVm: VirtualMachine;

  public filterData: VmFilter;

  public showSections = false;
  public showSubsections = false;

  public sections: Array<VmListSection> = [];
  public subsections: Array<VmListSubsection> = [];

  private vmList: Array<VirtualMachine>;

  constructor (
    private vmService: VmService,
    private dialogService: MdlDialogService,
    private translateService: TranslateService,
    @Inject('IStorageService') protected storageService: IStorageService,
    private jobsNotificationService: JobsNotificationService,
    private asyncJobService: AsyncJobService,
    private statsUpdateService: StatsUpdateService,
    private serviceOfferingService: ServiceOfferingService
  ) { }

  public ngOnInit(): void {
    this.getVmList();
    this.resubscribeToJobs();
    this.subscribeToStatsUpdates();
    this.subscribeToVmUpdates();
    this.subscribeToVmDestroyed();
    this.subscribeToSnapshotAdded();
    this.subscribeToVmDestroyed();
  }

  public get anyFilteringResults(): boolean {
    return (this.showSections && !this.sectionsLength) ||
      (!this.showSections && this.showSubsections && !this.subsectionsLength);
  }

  public get sectionsLength(): number {
    return this.sections.reduce((acc, section) => {
      if (section.vmList) {
        return acc + section.vmList.length;
      }
      if (section.subsectionList) {
        return acc + this.getSubsectionListLength(section.subsectionList);
      }
    }, 0);
  }

  public get subsectionsLength(): number {
    return this.getSubsectionListLength(this.subsections);
  }

  public updateFilters(filterData?: VmFilter): void {
    if (!this.vmList) {
      return;
    }
    if (!filterData && !this.filterData) {
      return;
    }
    if (!filterData) {
      filterData = this.filterData;
    }
    if (!this.filterData) {
      this.filterData = filterData;
    }

    this.filterData = filterData;

    let sectionKey = this.getFilterKey(filterData.mode);
    let subsectionKey = this.getFilterKey(this.getSubsectionType(filterData.mode));

    this.showSections = !!filterData[sectionKey].length;
    this.showSubsections = !!filterData[subsectionKey].length;
    this.groupByColors = filterData.doFilterByColor;
    this.sections = [];
    this.subsections = [];

    if (filterData.doFilterByColor) {
      this.vmList = this.sortByColor(this.vmList);
    } else {
      this.vmList = this.sortByDate(this.vmList);
    }

    if (this.showSections) {
      this.updateSections(filterData);
    }

    if (!this.showSections && this.showSubsections) {
      this.updateSubsections(filterData);
    }
  }

  public updateStats(): void {
    this.vmStats.updateStats();
  }

  public vmAction(e: IVmActionEvent): void {
    this.translateService.get([
      'YES',
      'NO',
      e.action.confirmMessage
    ])
      .switchMap((strs) => {
        return this.dialogService.confirm(strs[e.action.confirmMessage], strs.NO, strs.YES);
      })
      .onErrorResumeNext()
      .subscribe(() => this.vmService.vmAction(e));
  }

  public onVmCreated(vm: VirtualMachine): void {
    this.vmList.push(vm);
    this.updateFilters();
    this.updateStats();
  }

  public showDetail(vm: VirtualMachine): void {
    if (vm.state === 'Error') {
      return;
    }
    this.isDetailOpen = true;
    this.selectedVm = vm;
  }

  public hideDetail(): void {
    this.isDetailOpen = false;
  }

  public showVmCreationDialog(): void {
    this.dialogService.showCustomDialog({
      component: VmCreationComponent,
      clickOutsideToClose: false,
      styles: {'width': '780px', 'padding': '0'},
    })
      .switchMap(res => res.onHide())
      .switchMap(res => res)
      .subscribe((vm: VirtualMachine) => {
        if (vm) {
          this.onVmCreated(vm);
        }
      }, () => {});
  }

  private getVmList(): void {
    this.vmService.getList()
      .subscribe(vmList => {
        this.vmList = vmList;
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
      .subscribe(updatedVm => {
        this.vmList.forEach((vm, index, vmList) => {
          if (vm.id !== updatedVm.id) { return; }
          this.updateStats();
          this.serviceOfferingService.get(updatedVm.serviceOfferingId)
            .subscribe(serviceOffering => {
              vmList[index].cpuSpeed = updatedVm.cpuSpeed;
              vmList[index].memory = updatedVm.memory;
              vmList[index].cpuNumber = updatedVm.cpuNumber;
              vmList[index].serviceOffering = serviceOffering;
              vmList[index].serviceOfferingId = updatedVm.serviceOfferingId;
            });
        });
        this.updateFilters();
      });
  }

  private resubscribeToJobs(): void {
    this.vmService.resubscribe()
      .subscribe(observables => {
        observables.forEach(observable => {
          observable.subscribe(job => {
            const action = VirtualMachine.getAction(job.cmd);
            this.translateService.get([
              'YES',
              'NO',
              action.confirmMessage,
              action.progressMessage,
              action.successMessage
            ])
              .subscribe(strs => {
                this.jobsNotificationService.add({
                  message: strs[action.successMessage],
                  status: INotificationStatus.Finished
                });
              });
          });
        });
      });
  }

  private subscribeToVmDestroyed(): void {
    this.asyncJobService.event.subscribe((job: IAsyncJob<any>) => {
      if (!job.jobResult) {
        return;
      }

      const state = job.jobResult.state;
      if (job.jobInstanceType === 'VirtualMachine' && (state === 'Destroyed' || state === 'Expunging')) {
        this.vmList = this.vmList.filter(vm => vm.id !== job.jobResult.id);
        if (this.selectedVm && this.selectedVm.id === job.jobResult.id) {
          this.isDetailOpen = false;
        }
        this.updateFilters();
        this.updateStats();
      }
    });
  }

  private subscribeToSnapshotAdded(): void {
    this.asyncJobService.event.subscribe((job: IAsyncJob<any>) => {
      if (job.jobResult && job.jobInstanceType === 'Snapshot') {
        this.vmList.forEach((vm, index, array) => {
          let vol = vm.volumes.findIndex(volume => volume.id === job.jobResult.volumeId);
          if (vol !== -1) { array[index].volumes[vol].snapshots.unshift(job.jobResult); }
        });
      }
    });
  }

  private showSuggestionDialog(): void {
    if (this.storageService.read(askToCreateVm) === 'false') {
      return;
    }
    this.translateService.get([
      'YES',
      'NO',
      'NO_DONT_ASK',
      'WOULD_YOU_LIKE_TO_CREATE_VM'
    ]).subscribe(translations => {
      this.dialogService.showDialog({
        message: translations['WOULD_YOU_LIKE_TO_CREATE_VM'],
        actions: [
          {
            handler: () => {
              this.showVmCreationDialog();
            },
            text: translations['YES']
          },
          {
            handler: () => { },
            text: translations['NO']
          },
          {
            handler: () => {
              this.storageService.write(askToCreateVm, 'false');
            },
            text: translations['NO_DONT_ASK']
          }
        ],
        fullWidthAction: true,
        isModal: true,
        clickOutsideToClose: true,
        styles: { 'width': '320px' }
      });
    });
  }

  private filterVmsByGroup(vmList: Array<VirtualMachine>, group: InstanceGroup): Array<VirtualMachine> {
    return vmList.filter(vm => vm.group === group.name);
  }

  private filterVmsByZone(vmList: Array<VirtualMachine>, zone: Zone): Array<VirtualMachine> {
    return vmList.filter(vm => vm.zoneId === zone.id);
  }

  private sortByColor(vmList: Array<VirtualMachine>): Array<VirtualMachine> {
    return vmList.sort((vmA, vmB) => {
      let vmAColor = this.vmService.getColor(vmA).value;
      let vmBColor = this.vmService.getColor(vmB).value;

      if (vmAColor < vmBColor) {
        return -1;
      }
      if (vmAColor > vmBColor) {
        return 1;
      }
      return 0;
    });
  }

  private sortByDate(vmList: Array<VirtualMachine>): Array<VirtualMachine> {
    return vmList.sort((vmA, vmB) => {
      let vmACreated = vmA.created;
      let vmBCreated = vmB.created;

      if (vmACreated > vmBCreated) {
        return 1;
      }
      if (vmACreated < vmBCreated) {
        return -1;
      }
      return 0;
    });
  }

  private getFilterKey(sectionType: SectionType): string {
    if (sectionType === SectionType.group) {
      return 'selectedGroups';
    }
    if (sectionType === SectionType.zone) {
      return 'selectedZones';
    }
  }

  private getSubsectionType(sectionType: SectionType): SectionType {
    if (sectionType === SectionType.group) {
      return SectionType.zone;
    }
    if (sectionType === SectionType.zone) {
      return SectionType.group;
    }
  }

  private updateSections(filterData: VmFilter): void {
    let filterDataKey = this.getFilterKey(filterData.mode);

    this.sections = filterData[filterDataKey]
      .map((elem): VmListSection => {
        let vmList = filterData.mode === SectionType.group ?
          this.filterVmsByGroup(this.vmList, elem) :
          this.filterVmsByZone(this.vmList, elem);

        let subsectionList = this.getSubsectionList(vmList, filterData);

        if (this.showSubsections) {
          return { name: elem.name, subsectionList };
        }
        return { name: elem.name, vmList };
      });
  }

  private updateSubsections(filterData: VmFilter): void {
    this.subsections = this.getSubsectionList(this.vmList, filterData);
  }

  private getSubsectionList(
    vmList: Array<VirtualMachine>,
    filterData: VmFilter
  ): Array<VmListSubsection> {
    let subsectionType = this.getSubsectionType(filterData.mode);
    let filterDataKey = this.getFilterKey(subsectionType);

    return filterData[filterDataKey]
      .map(elem => {
        return {
          name: elem.name,
          vmList: subsectionType === SectionType.group ?
            this.filterVmsByGroup(vmList, elem) :
            this.filterVmsByZone(vmList, elem)
        };
      });
  }

  private getSubsectionListLength(subsectionList: Array<VmListSubsection>): number {
    return subsectionList.reduce((acc, subsection) => {
      return acc + subsection.vmList.length;
    }, 0);
  }
}
