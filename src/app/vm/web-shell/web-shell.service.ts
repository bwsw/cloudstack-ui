import { Injectable } from '@angular/core';
import { VirtualMachineTagKeys } from '../../shared/services/tags/vm-tag-keys';
import { VirtualMachine, VmState } from '../shared/vm.model';
import { ConfigService } from '../../core/services';


const portToken = 'csui.vm.ssh.port';
const userToken = 'csui.vm.ssh.user';

const defaultPort = '22';
const defaultUser = 'root';

enum AuthModeType {
  SSH = 'ssh'
}

export const WebShellAddress = 'cs-extensions/webshell';

@Injectable()
export class WebShellService {
  public static getWebShellAddress(vm: VirtualMachine): string {

    const getPort = (machine: VirtualMachine): string => {
      const portTag = machine.tags.find(tag => tag.key === portToken);
      return portTag && portTag.value || defaultPort;
    };

    const getUser = (machine: VirtualMachine): string => {
      const userTag = machine.tags.find(tag => tag.key === userToken);
      return userTag && userTag.value || defaultUser;
    };
    const ip = vm.nic[0].ipaddress;
    const port = getPort(vm);
    const user = getUser(vm);

    return `${WebShellAddress}/?${ip}/${port}/${user}`;
  }

  public static isWebShellEnabledForVm(vm: VirtualMachine): boolean {
    if (!vm) {
      return false;
    }

    const authModeTag = vm.tags.find(tag => tag.key === VirtualMachineTagKeys.authModeToken);
    const authMode = authModeTag && authModeTag.value;
    const sshEnabledOnVm = authMode && authMode.split(',')
      .find(mode => mode.toLowerCase() === AuthModeType.SSH);
    const vmIsRunning = vm.state === VmState.Running;

    return sshEnabledOnVm && vmIsRunning;
  }

  constructor(public configService: ConfigService) {
  }

  public get isWebShellEnabled(): boolean {
    const extensions = this.configService.get('extensions');
    return extensions && extensions.webShell;
  }


}
