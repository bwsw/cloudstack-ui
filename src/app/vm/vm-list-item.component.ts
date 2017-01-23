import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';

import { VirtualMachine, IVmAction } from './vm.model';
import { AsyncJobService } from '../shared/services/async-job.service';
import { IAsyncJob } from '../shared/models/async-job.model';
import { MdlDialogService } from 'angular2-mdl';
import {
  PasswordDialogComponent,
  PasswordDialogModel,
  VM_PASSWORD_TOKEN,
} from '../vm/password-dialog';


@Component({
  selector: 'cs-vm-list-item',
  templateUrl: './vm-list-item.component.html',
  styleUrls: ['./vm-list-item.component.scss']
})
export class VmListItemComponent implements OnInit {
  @Input() public vm: VirtualMachine;
  @Output() public onVmAction = new EventEmitter();
  @Output() public onClick = new EventEmitter();

  public actions: Array<IVmAction>;

  constructor(
    private asyncJobService: AsyncJobService,
    private dialogService: MdlDialogService
  ) {}

  public ngOnInit() {
    this.actions = this.vm.actions.map(a => VirtualMachine.getAction(a));
    this.asyncJobService.event.subscribe((job: IAsyncJob<VirtualMachine>) => {
      if (job.jobResult && job.jobResult.id === this.vm.id) {
        this.vm.state = job.jobResult.state;
        this.vm.nic[0] = job.jobResult.nic[0];
        if (job.jobResult.password) {
          this.showPasswordDialog(job.jobResult.displayName, job.jobResult.password);
        }
      }
    });
  }

  public handleClick(e: MouseEvent) {
    e.stopPropagation();
    this.onClick.emit(this.vm);
  }

  public getAction(event: MouseEvent, act: string) {
    event.stopPropagation();
    let e = {
      id: this.vm.id,
      action: this.actions.find(a => a.nameLower === act),
      vm: this.vm
    };

    if (act === 'restore') {
      e['templateId'] = this.vm.templateId;
    }

    this.onVmAction.emit(e);
  }

  private showPasswordDialog(vmName: string, vmPassword: string): void {
    this.dialogService.showCustomDialog({
      component: PasswordDialogComponent,
      providers: [{
        provide: VM_PASSWORD_TOKEN,
        useValue: new PasswordDialogModel(vmName, vmPassword)
      }],
      isModal: true,
      styles: {'width': '350px'}
    });
  }
}
