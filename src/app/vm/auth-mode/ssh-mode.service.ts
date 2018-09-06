import { ConfigService } from '../../core/services';
import { VirtualMachineTagKeys } from '../../shared/services/tags/vm-tag-keys';
import { Injectable } from '@angular/core';

export const WebShellAddress = 'cs-extensions/webshell';
const defaultPort = '22';
const defaultLogin = 'root';

enum AuthModeType {
  SSH = 'ssh'
}

@Injectable()
export class SshModeService {

  public static getAddress(vm): string {

    const getPort = (machine): string => {
      const portTag = machine.tags.find(tag => tag.key === VirtualMachineTagKeys.sshPortToken);
      return portTag && portTag.value || defaultPort;
    };

    const getLogin = (machine): string => {
      const userTag = machine.tags.find(tag => tag.key === VirtualMachineTagKeys.sshLoginToken);
      return userTag && userTag.value || defaultLogin;
    };
    const ip = vm.nic[0].ipaddress;
    const port = getPort(vm);
    const user = getLogin(vm);

    return `${WebShellAddress}/?${ip}/${port}/${user}`;
  }

  public static isWebShellEnabledForVm(vm): boolean {
    if (!vm) {
      return false;
    }

    const authModeTag = vm.tags.find(tag => tag.key === VirtualMachineTagKeys.authModeToken);
    const authMode = authModeTag && authModeTag.value;
    const sshEnabledOnVm = authMode && authMode.replace(/\s/g, '').split(',')
      .find(mode => mode.toLowerCase() === AuthModeType.SSH);
    const vmIsRunning = vm.state === 'Running';

    return sshEnabledOnVm && vmIsRunning;
  }

  public get isWebShellEnabled(): boolean {
    const extensions = this.configService.get('extensions');
    return extensions && extensions.webShell;
  }

  constructor(public configService: ConfigService) {
  }
}
