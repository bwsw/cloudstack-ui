import { Injectable } from '@angular/core';
import { VirtualMachine, VmStates } from '../vm/shared/vm.model';
import { Observable } from 'rxjs/Observable';
import { ConfigService } from '../shared/services/config.service';


const webSSHAddressToken = 'webSSHAddress';

export const AuthModeToken = 'AUTH_MODE';
const portToken = 'SSH_PORT';
const userToken = 'SSH_USER';

const defaultPort = '22';
const defaultUser = 'root';

type AuthModeType = 'SSH';
const AuthModeTypes = {
  SSH: 'SSH' as AuthModeType
};

@Injectable()
export class WebShellService {
  constructor(public configService: ConfigService) {}

  private get isWebShellAddressSpecified(): boolean {
    return !!this.configService.get(webSSHAddressToken);
  }

  public isWebShellEnabled(vm: VirtualMachine): boolean {
    if (!vm) {
      return false;
    }

    const authModeTag = vm.tags.find(tag => tag.key === AuthModeToken);
    const authMode = authModeTag && authModeTag.value;
    const sshEnabledOnVm = authMode === AuthModeTypes.SSH;
    const vmIsRunning = vm.state === VmStates.Running;

    return this.isWebShellAddressSpecified && sshEnabledOnVm && vmIsRunning;
  }

  public getWebShellAddress(vm: VirtualMachine): string {
    const baseAddress = this.configService.get(webSSHAddressToken);

    if (!baseAddress) {
      return undefined;
    }

    const ip = vm.nic[0].ipAddress;
    const port = this.getPort(vm);
    const user = this.getUser(vm);

    return `${baseAddress}/?${ip}/${port}/${user}`;
  }

  private getPort(vm: VirtualMachine): string {
    const portTag = vm.tags.find(tag => tag.key === portToken);
    return portTag && portTag.value || defaultPort;
  }

  private getUser(vm: VirtualMachine): string {
    const userTag = vm.tags.find(tag => tag.key === userToken);
    return userTag && userTag.value || defaultUser;
  }

}
