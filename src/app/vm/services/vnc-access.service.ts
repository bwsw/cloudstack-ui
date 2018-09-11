import { Injectable } from '@angular/core';
import { AccessService, AuthModeType } from './access.service';
import { VirtualMachine } from '../';

@Injectable()
export class VncAccessService extends AccessService {
  protected readonly authMode = AuthModeType.VNC;

  public getAddress(vm: VirtualMachine): string {
    return `client/console?cmd=access&vm=${vm.id}`;
  }
}
