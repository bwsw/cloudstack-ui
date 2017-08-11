import { Injectable } from '@angular/core';
import { VirtualMachine, VmState } from '../shared/vm.model';
import { ConfigService } from '../../shared/services/config.service';


export const AuthModeToken = 'csext.webshell.auth-mode';
const portToken = 'csext.webshell.port';
const userToken = 'csext.webshell.user';

const defaultPort = '22';
const defaultUser = 'root';

enum AuthModeType {
  SSH = 'SSH'
}

@Injectable()
export class WebShellService {
  constructor(public configService: ConfigService) {}

  public get isWebShellAddressSpecified(): boolean {
    return !!this.webShellAddress;
  }

  private get webShellAddress(): string {
    const extensions = this.configService.get('extensions');
    return extensions && extensions.webShell && extensions.webShell.address;
  }

  public isWebShellEnabledForVm(vm: VirtualMachine): boolean {
    if (!vm) {
      return false;
    }

    const authModeTag = vm.tags.find(tag => tag.key === AuthModeToken);
    const authMode = authModeTag && authModeTag.value;
    const sshEnabledOnVm = authMode === AuthModeType.SSH;
    const vmIsRunning = vm.state === VmState.Running;

    return !!this.webShellAddress && sshEnabledOnVm && vmIsRunning;
  }

  public getWebShellAddress(vm: VirtualMachine): string {
    if (!this.webShellAddress) {
      return undefined;
    }

    const ip = vm.nic[0].ipAddress;
    const port = this.getPort(vm);
    const user = this.getUser(vm);

    return `${this.webShellAddress}/?${ip}/${port}/${user}`;
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
