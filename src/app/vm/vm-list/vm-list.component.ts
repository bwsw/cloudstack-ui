import { Component, OnInit, Inject, ViewChild } from '@angular/core';

import { VmService } from '../vm.service';
import { VirtualMachine } from '../vm.model';
import { MdlDialogService } from 'angular2-mdl';
import { TranslateService } from 'ng2-translate';
import { IStorageService } from '../../shared/services/storage.service';
import { VmCreationComponent } from '../vm-creation/vm-creation.component';
import {
  JobsNotificationService,
  INotificationStatus
} from '../../shared/services/jobs-notification.service';

import { IVmAction } from '../vm.model';
import { IAsyncJob } from '../../shared/models/async-job.model';
import { AsyncJobService } from '../../shared/services/async-job.service';
import { VmStatisticsComponent } from '../vm-statistics/vm-statistics.component';
import * as UUID from 'uuid';


interface IVmActionEvent {
  id: string;
  action: IVmAction;
  vm: VirtualMachine;
  templateId?: string;
}

@Component({
  selector: 'cs-vm-list',
  templateUrl: 'vm-list.component.html',
  styleUrls: ['vm-list.component.scss']
})
export class VmListComponent implements OnInit {
  @ViewChild(VmStatisticsComponent) public vmStats: VmStatisticsComponent;
  @ViewChild(VmCreationComponent) public vmCreationForm: VmCreationComponent;

  private vmList: Array<VirtualMachine>;
  private selectedVm: VirtualMachine;
  private isDetailOpen: boolean;

  constructor (
    private vmService: VmService,
    private dialogService: MdlDialogService,
    private translateService: TranslateService,
    @Inject('IStorageService') protected storageService: IStorageService,
    private jobsNotificationService: JobsNotificationService,
    private asyncJobService: AsyncJobService
  ) { }

  public ngOnInit(): void {
    this.vmService.getList()
      .then(vmList => {
        this.vmList = vmList;

        if (this.vmList.length) {
          return;
        }

        if (this.storageService.read('askToCreateVm') === 'false') {
          return;
        }

        this.translateService.get([
          'YES',
          'NO',
          'NO_DONT_ASK',
          'WOULD_YOU_LIKE_TO_CREATE_VM'
        ]).subscribe(translations => {
          this.showDialog(translations);
        });
      });
    this.asyncJobService.event.subscribe((job: IAsyncJob<any>) => {
      if (job.jobResult && job.jobResult.state === 'Destroyed') {
        this.vmList.splice(this.vmList.findIndex(vm => vm.id === job.jobResult.id), 1);
        if (this.selectedVm && this.selectedVm.id === job.jobResult.id) {
          this.isDetailOpen = false;
        }
        this.vmStats.updateStats();
      }
    });
    this.vmService.resubscribe().then(observables => {
      observables.forEach(observable => {
        observable.subscribe(job => {
          const action = VirtualMachine.getAction(job.cmd);
          this.translateService.get([
            'YES',
            'NO',
            action.confirmMessage,
            action.progressMessage,
            action.successMessage
          ]).subscribe(strs => {
            this.jobsNotificationService.add({
              id: UUID.v4(),
              message: strs[action.successMessage],
              status: INotificationStatus.Finished
            });
          });
        });
      });
    });
    this.vmService.vmUpdateObservable.subscribe(updatedVm => {
      this.vmList.forEach((vm, index, array) => {
        if (vm.id === updatedVm.id) {
          this.vmService.get(updatedVm.id).then(result => {
            array[index] = result;
          });
          this.vmStats.updateStats();
        }
      });
    });
  }

  public onVmAction(e: IVmActionEvent): void {
    this.translateService.get([
      'YES',
      'NO',
      e.action.confirmMessage
    ]).flatMap((strs) => {
      return this.dialogService.confirm(strs[e.action.confirmMessage], strs.NO, strs.YES);
    }).subscribe(() => {
      if (e.action.commandName !== 'resetPasswordFor') {
        this.singleActionCommand(e);
      } else {
        this.resetPasswordAction(e);
      }
    },
    () => {});
  }

  public onVmCreated(e): void {
    this.vmList.push(e);
    this.vmStats.updateStats();
  }

  public showDetail(vm: VirtualMachine): void {
    this.isDetailOpen = true;
    this.selectedVm = vm;
  }

  public hideDetail(): void {
    this.isDetailOpen = false;
  }

  private showDialog(translations): void {
    this.dialogService.showDialog({
      message: translations['WOULD_YOU_LIKE_TO_CREATE_VM'],
      actions: [
        {
          handler: () => {
            this.vmCreationForm.show();
          },
          text: translations['YES']
        },
        {
          handler: () => { },
          text: translations['NO']
        },
        {
          handler: () => {
            this.storageService.write('askToCreateVm', 'false');
          },
          text: translations['NO_DONT_ASK']
        }
      ],
      fullWidthAction: true,
      isModal: true,
      clickOutsideToClose: true,
      styles: { 'width': '320px' }
    });
  }


  private singleActionCommand(e: IVmActionEvent): Promise<any> {
    return new Promise((resolve) => {
      let id;
      let strs;
      this.translateService.get([
        e.action.progressMessage,
        e.action.successMessage
      ]).flatMap((res) => {
        strs = res;
        id = this.jobsNotificationService.add(strs[e.action.progressMessage]);
        if (e.vm) {
          e.vm.state = e.action.vmStateOnAction;
        }
        return this.vmService.command(e.action.commandName, e.vm.id);
      }).subscribe(() => {
        this.jobsNotificationService.add({
          id,
          message: strs[e.action.successMessage],
          status: INotificationStatus.Finished
        });
        resolve();
      });
    });
  }

  private resetPasswordAction(e: IVmActionEvent) {
    if (e.vm.state === 'Stopped') {
      this.singleActionCommand(e);
    } else {
      let stop: IVmActionEvent = {
        id: e.id,
        action: VirtualMachine.getAction('stop'),
        vm: e.vm,
        templateId: e.templateId
      };
      let start: IVmActionEvent = {
        id: e.id,
        action: VirtualMachine.getAction('start'),
        vm: e.vm,
        templateId: e.templateId
      };

      this.singleActionCommand(stop)
        .then(() => this.singleActionCommand(e))
        .then(() => this.singleActionCommand(start));
    }
  }
}
