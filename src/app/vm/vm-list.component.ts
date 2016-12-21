import { Component, OnInit, Inject } from '@angular/core';

import { VmService } from './vm.service';
import { VirtualMachine } from './vm.model';
import { MdlDialogService } from 'angular2-mdl';
import { TranslateService } from 'ng2-translate';
import { IStorageService } from '../shared/services/storage.service';
import {
  JobsNotificationService,
  INotificationStatus
} from '../shared/services/jobs-notification.service';


interface IVmAction {
  id: string;
  action: string;
  vm: VirtualMachine;
  templateId?: string;
}

@Component({
  selector: 'cs-vm-list',
  templateUrl: './vm-list.component.html'
})
export class VmListComponent implements OnInit {
  private vmList: Array<VirtualMachine>;

  constructor (
    private vmService: VmService,
    private dialogService: MdlDialogService,
    private translateService: TranslateService,
    @Inject('IStorageService') protected storageService: IStorageService,
    private jobsNotificationService: JobsNotificationService
  ) { }

  public ngOnInit() {
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
  }

  public update(liteUpdate: boolean) {
    if (liteUpdate) {
      this.vmService.getList(true)
        .then(vmList => {
          vmList.forEach((vm) => {
            this.vmList.find((thisvm) => {
              return vm.id === thisvm.id;
            }).state = vm.state;
          });
        });
    } else {
      this.vmService.getList()
        .then(vmList => this.vmList = vmList);
    }
  }

  public onVmAction(e: IVmAction) {
    switch (e.action) {
      case 'start':
        this.translateService.get([
          'CONFIRM_VM_START',
          'NO',
          'YES',
          'STARTING_A_VM',
          'STARTING',
          'VM_HAS_STARTED'
        ]).subscribe(strs => {
          this.dialogService.confirm(strs.CONFIRM_VM_START, strs.NO, strs.YES)
            .toPromise() // hack to fix incorrect component behavior
            .then(r => {
              e.vm.state = 'Starting';
              let id = this.jobsNotificationService.add(strs.STARTING_A_VM);
              this.vmService.startVM(e.id)
                .subscribe(res => {
                  this.update(true);
                  this.jobsNotificationService.add({
                    id,
                    message: strs.VM_HAS_STARTED,
                    status: INotificationStatus.Finished
                  });
                });
            })
            .catch(() => {});
        });
        break;
      case 'stop':
        this.translateService.get([
          'CONFIRM_VM_STOP',
          'NO',
          'YES',
          'STOPPING_A_VM',
          'VM_HAS_BEEN_STOPPED'
        ]).subscribe(strs => {
          this.dialogService.confirm(strs.CONFIRM_VM_STOP, strs.NO, strs.YES)
            .toPromise()
            .then(r => {
              e.vm.state = 'Stopping';
              let id = this.jobsNotificationService.add(strs.STOPPING_A_VM);
              this.vmService.stopVM(e.id)
                .subscribe(res => {
                  this.update(true);
                  this.jobsNotificationService.add({
                    id,
                    message: strs.VM_HAS_BEEN_STOPPED,
                    status: INotificationStatus.Finished
                  });

                });
            })
            .catch(() => {});
        });
        break;
      case 'reboot':
        this.translateService.get([
          'CONFIRM_VM_REBOOT',
          'NO',
          'YES',
          'REBOOTING_A_VM',
          'VM_HAS_BEEN_REBOOTED'
        ]).subscribe(strs => {
          this.dialogService.confirm(strs.CONFIRM_VM_REBOOT, strs.NO, strs.YES)
            .toPromise()
            .then(r => {
              e.vm.state = 'Rebooting';
              let id = this.jobsNotificationService.add(strs.REBOOTING_A_VM);
              this.vmService.rebootVM(e.id)
                .subscribe(res => {
                  this.update(true);
                  this.jobsNotificationService.add({
                    id,
                    message: strs.VM_HAS_BEEN_REBOOTED,
                    status: INotificationStatus.Finished
                  });
                });
            })
            .catch(() => {});
        });
        break;
      case 'restore':
        this.translateService.get([
          'CONFIRM_VM_RESTORE',
          'NO',
          'YES',
          'RESTORING_A_VM',
          'VM_HAS_BEEN_RESTORED'
        ]).subscribe(strs => {
          this.dialogService.confirm(strs.CONFIRM_VM_RESTORE, strs.NO, strs.YES)
            .toPromise()
            .then(r => {
              e.vm.state = 'Restoring';
              let id = this.jobsNotificationService.add(strs.RESTORING_A_VM);
              this.vmService.restoreVM(e.id, e.templateId)
                .subscribe(res => {
                  this.update(false);
                  this.jobsNotificationService.add({
                    id,
                    message: strs.VM_HAS_BEEN_RESTORED,
                    status: INotificationStatus.Finished
                  });
                });
            })
            .catch(() => {});
        });
        break;
      case 'destroy':
        this.translateService.get([
          'CONFIRM_VM_DESTROY',
          'NO',
          'YES',
          'DESTROYING_A_VM',
          'VM_HAS_BEEN_DESTROYED'
        ]).subscribe(strs => {
          this.dialogService.confirm(strs.CONFIRM_VM_DESTROY, strs.NO, strs.YES)
            .toPromise()
            .then(r => {
              e.vm.state = 'Destroying';
              let id = this.jobsNotificationService.add(strs.DESTROYING_A_VM);
              this.vmService.destroyVM(e.id)
                .subscribe(res => {
                  this.update(false);
                  this.jobsNotificationService.add({
                    id,
                    message: strs.VM_HAS_BEEN_DESTROYED,
                    status: INotificationStatus.Finished
                  });
                });
            })
            .catch(() => {});
        });
        break;
    }
  }

  private showDialog(translations): void {
    this.dialogService.showDialog({
      message: translations['WOULD_YOU_LIKE_TO_CREATE_VM'],
      actions: [
        {
          handler: () => {
            console.log('show vm create dialog'); // temporary
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
}
