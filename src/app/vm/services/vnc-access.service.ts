import { Injectable } from '@angular/core';
import { AccessService, AuthModeType } from './access.service';
import { VirtualMachine } from '../';
import { virtualMachineTagKeys } from '../../shared/services/tags/vm-tag-keys';

@Injectable()
export class VncAccessService extends AccessService {
  protected readonly authMode = AuthModeType.VNC;

  public getAddress(vm: VirtualMachine): string {
    return `client/console?cmd=access&vm=${vm.id}`;
  }

  public getLogin(vm: VirtualMachine): string {
    return this.getTagValue(vm.tags, virtualMachineTagKeys.loginTag) || this.defaultLogin;
  }

  public getPassword(vm: VirtualMachine): string {
    return this.getTagValue(vm.tags, virtualMachineTagKeys.passwordTag);
  }
}
