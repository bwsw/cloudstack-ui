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
import { IStorageService } from '../../shared/services/storage.service';
import { VmCreationComponent } from '../vm-creation/vm-creation.component';
import {
  JobsNotificationService,
  INotificationStatus
} from '../../shared/services/jobs-notification.service';

import { IAsyncJob } from '../../shared/models/async-job.model';
import { AsyncJobService } from '../../shared/services/async-job.service';
import { VmStatisticsComponent } from '../../shared/components/vm-statistics/vm-statistics.component';
import { StatsUpdateService } from '../../shared/services/stats-update.service';
import { ServiceOfferingService } from '../../shared/services/service-offering.service';

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

  public isDetailOpen: boolean;
  public selectedVm: VirtualMachine;
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

  public updateStats(): void {
    this.vmStats.updateStats();
  }

  public vmAction(e: IVmActionEvent): void {
    this.vmService.vmAction(e);
  }

  public onVmCreated(vm: VirtualMachine): void {
    this.vmList.push(vm);
    this.updateStats();
  }

  public showDetail(vm: VirtualMachine): void {
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
      if (job.jobResult && job.jobInstanceType === 'VirtualMachine' && job.jobResult.state === 'Destroyed') {
        this.vmList = this.vmList.filter(vm => vm.id !== job.jobResult.id);
        if (this.selectedVm && this.selectedVm.id === job.jobResult.id) {
          this.isDetailOpen = false;
        }
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
}
