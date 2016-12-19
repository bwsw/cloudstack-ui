import { Component, OnInit } from '@angular/core';

import { VmService } from './vm.service';
import { VirtualMachine } from './vm.model';

import { MdlDialogService } from 'angular2-mdl';
import { TranslateService } from 'ng2-translate';

interface IVmAction {
  id: string,
  action: string
  templateId?: string
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
    private translate: TranslateService
  ) {}

  public ngOnInit() {
    this.update();
  }

  public update(id?: string) {
    this.vmService.getList()
      .then(vmList => this.vmList = vmList);
  }

  public onVmAction(e: IVmAction) {
    switch (e.action) {
      case 'start':
        this.translate.get(['CONFIRM_VM_START', 'NO', 'YES']).subscribe(strs => {
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
        this.translate.get(['CONFIRM_VM_STOP', 'NO', 'YES']).subscribe(strs => {
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
        this.translate.get(['CONFIRM_VM_REBOOT', 'NO', 'YES']).subscribe(strs => {
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
        this.translate.get(['CONFIRM_VM_RESTORE', 'NO', 'YES']).subscribe(strs => {
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
        this.translate.get(['CONFIRM_VM_DESTROY', 'NO', 'YES']).subscribe(strs => {
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
