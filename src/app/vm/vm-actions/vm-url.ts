import { VirtualMachineAction } from './vm-action';
import { VirtualMachine, VmState } from '../shared/vm.model';
import { DialogService } from '../../dialog/dialog-service/dialog.service';
import { VmService } from '../shared/vm.service';
import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { JobsNotificationService } from '../../shared/services/jobs-notification.service';

const AuthModeToken = 'csui.vm.auth-mode';
const protocolToken = 'csui.vm.http.protocol';
const portToken = 'csui.vm.http.port';
const pathToken = 'csui.vm.http.path';
const loginToken = 'csui.vm.http.login';
const passwordToken = 'csui.vm.http.password';

enum AuthModeType {
  HTTP = 'http'
}

@Injectable()
export class VmURLAction extends VirtualMachineAction {

  constructor(
    protected dialogService: DialogService,
    protected jobsNotificationService: JobsNotificationService,
    protected vmService: VmService,
  ) {
    super(dialogService, jobsNotificationService, vmService);
  }

  public activate(vm: VirtualMachine): Observable<void> {
    const protocol = this.getProtocol(vm);
    const port = this.getPort(vm);
    const path = this.getPath(vm);
    const ip = vm.nic[0].ipAddress;

    const address = `${protocol}://${ip}:${port}${path}`;
    window.open(
      address,
      vm.displayName,
      'resizable=0,width=820,height=640'
    );
    return Observable.of(null);
  }

  public canActivate(vm: VirtualMachine): boolean {
    const authModeTag = vm.tags.find(tag => tag.key === AuthModeToken);
    const authMode = authModeTag && authModeTag.value;
    const mode = authMode && authMode.split(',').find(mode => mode === AuthModeType.HTTP);
    return mode && vm.state === VmState.Running;
  }

  public getLogin(vm: VirtualMachine): string {
    const loginTag = vm.tags.find(tag => tag.key === loginToken);
    return loginTag && loginTag.value;
  }

  public getPassword(vm: VirtualMachine): string {
    const passwordTag = vm.tags.find(tag => tag.key === passwordToken);
    return passwordTag && passwordTag.value;
  }

  private getPort(vm: VirtualMachine): string {
    const portTag = vm.tags.find(tag => tag.key === portToken);
    return portTag && portTag.value || '80';
  }

  private getPath(vm: VirtualMachine): string {
    const pathTag = vm.tags.find(tag => tag.key === pathToken);
    return pathTag && pathTag.value;
  }

  private getProtocol(vm: VirtualMachine): string {
    const protocolTag = vm.tags.find(tag => tag.key === protocolToken);
    return protocolTag && protocolTag.value || 'http';
  }
}