import { Component, OnInit, Inject } from '@angular/core';

import { VmService } from './vm.service';
import { VirtualMachine } from './vm.model';
import { MdlDialogService } from 'angular2-mdl';
import { TranslateService } from 'ng2-translate';
import { IStorageService } from '../shared/services/storage.service';


interface IVmAction {
  id: string;
  action: string;
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

  public update() {
    this.vmService.getList()
      .then(vmList => this.vmList = vmList);
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

  public onVmAction(e: IVmAction) {
    switch (e.action) {
      case 'start':
        this.translateService.get(['CONFIRM_VM_START', 'NO', 'YES']).subscribe(strs => {
          this.dialogService.confirm(strs.CONFIRM_VM_START, strs.NO, strs.YES)
            .toPromise() // hack to fix incorrect component behavior
            .then(r => {
              this.vmService.startVM(e.id)
                .subscribe(res => {
                  this.update();
                });
            })
            .catch(() => {});
        });
        break;
      case 'stop':
        this.translateService.get(['CONFIRM_VM_STOP', 'NO', 'YES']).subscribe(strs => {
          this.dialogService.confirm(strs.CONFIRM_VM_STOP, strs.NO, strs.YES)
            .toPromise()
            .then(r => {
              this.vmService.stopVM(e.id)
                .subscribe(res => {
                  this.update();
                });
            })
            .catch(() => {});
        });
        break;
      case 'reboot':
        this.translateService.get(['CONFIRM_VM_REBOOT', 'NO', 'YES']).subscribe(strs => {
          this.dialogService.confirm(strs.CONFIRM_VM_RESTART, strs.NO, strs.YES)
            .toPromise()
            .then(r => {
              this.vmService.rebootVM(e.id)
                .subscribe(res => {
                  this.update();
                });
            })
            .catch(() => {});
        });
        break;
      case 'restore':
        this.translateService.get(['CONFIRM_VM_RESTORE', 'NO', 'YES']).subscribe(strs => {
          this.dialogService.confirm(strs.CONFIRM_VM_RESTORE, strs.NO, strs.YES)
            .toPromise()
            .then(r => {
              this.vmService.restoreVM(e.id, e.templateId)
                .subscribe(res => {
                  this.update();
                });
            })
            .catch(() => {});
        });
        break;
      case 'destroy':
        this.translateService.get(['CONFIRM_VM_DESTROY', 'NO', 'YES']).subscribe(strs => {
          this.dialogService.confirm(strs.CONFIRM_VM_DESTROY, strs.NO, strs.YES)
            .toPromise()
            .then(r => {
              this.vmService.destroyVM(e.id)
                .subscribe(res => {
                  this.update();
                });
            })
            .catch(() => {});
        });
        break;
    }
  }
}
