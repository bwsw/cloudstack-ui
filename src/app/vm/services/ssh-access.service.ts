import { ConfigService } from '../../core/services';
import { VirtualMachineTagKeys } from '../../shared/services/tags/vm-tag-keys';
import { Injectable } from '@angular/core';
import { AccessService, AuthModeType } from './access.service';
import { VirtualMachine } from '../';

@Injectable()
export class SshAccessService extends AccessService {
  protected readonly authMode = AuthModeType.SSH;

  private readonly WebShellAddress = 'cs-extensions/webshell';
  private readonly defaultPort = '22';
  private readonly defaultLogin = 'root';

  public get isWebShellEnabled(): boolean {
    const extensions = this.configService.get('extensions');
    return extensions && extensions.webShell;
  }

  constructor(public configService: ConfigService) {
    super();
  }

  public getAddress(vm): string {
    const ip = vm.nic[0].ipaddress;
    const port = this.getPort(vm);
    const user = this.getLogin(vm);

    return `${this.WebShellAddress}/?${ip}/${port}/${user}`;
  }

  public isWebShellEnabledForVm(vm): boolean {
    if (!vm) {
      return false;
    }

    const authMode = this.getTagValue(vm.tags, VirtualMachineTagKeys.authModeToken);
    if (authMode) {
      const authModes = authMode.replace(/\s/g, '').split(',');
      return !!authModes.find(mode => mode.toLowerCase() === this.authMode);
    }
    return false;
  }

  private getPort(vm: VirtualMachine): string {
    const portTag = this.getTagValue(vm.tags, VirtualMachineTagKeys.sshPortToken);
    return portTag || this.defaultPort;
  };

  private getLogin(vm: VirtualMachine): string {
    const userTag = this.getTagValue(vm.tags, VirtualMachineTagKeys.sshLoginToken);
    return userTag || this.defaultLogin;
  };
}
