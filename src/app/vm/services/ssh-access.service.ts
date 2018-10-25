import { virtualMachineTagKeys } from '../../shared/services/tags/vm-tag-keys';
import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';

import { AccessService, AuthModeType } from './access.service';
import { VirtualMachine } from '../';
import { configSelectors, State } from '../../root-store';

@Injectable()
export class SshAccessService extends AccessService {
  protected readonly authMode = AuthModeType.SSH;
  private readonly webShellAddress = 'cs-extensions/webshell';
  private readonly defaultPort = '22';
  private webShellEnabled: boolean;

  constructor(store: Store<State>) {
    super();
    store.pipe(select(configSelectors.get('extensions'))).subscribe(extensions => {
      this.webShellEnabled = extensions.webShell;
    });
  }

  public isWebShellEnabled(): boolean {
    return this.webShellEnabled;
  }

  public getAddress(vm): string {
    const ip = vm.nic[0].ipaddress;
    const port = this.getPort(vm);
    const user = this.getLogin(vm);

    return `${this.webShellAddress}/?${ip}/${port}/${user}`;
  }

  public isSshAuthMode(vm): boolean {
    if (!vm) {
      return false;
    }

    const authMode = this.getTagValue(vm.tags, virtualMachineTagKeys.authModeToken);
    if (authMode) {
      const authModes = authMode.replace(/\s/g, '').split(',');
      return !!authModes.find(mode => mode.toLowerCase() === this.authMode);
    }
    return false;
  }

  public getPort(vm: VirtualMachine): string {
    const portTag = this.getTagValue(vm.tags, virtualMachineTagKeys.sshPortToken);
    return portTag || this.defaultPort;
  }

  public getLogin(vm: VirtualMachine): string {
    const sshLogin = this.getTagValue(vm.tags, virtualMachineTagKeys.sshLoginToken);
    const vmLogin = this.getTagValue(vm.tags, virtualMachineTagKeys.loginTag);
    return sshLogin || vmLogin || this.defaultLogin;
  }

  public getPassword(vm: VirtualMachine): string {
    const sshPassword = this.getTagValue(vm.tags, virtualMachineTagKeys.sshPasswordToken);
    const vmPassword = this.getTagValue(vm.tags, virtualMachineTagKeys.passwordTag);
    return sshPassword || vmPassword;
  }

  public getIpv4ConnectionString(vm: VirtualMachine): string {
    return `ssh -p ${this.getPort(vm)} -u ${this.getLogin(vm)} ${vm.nic[0].ipaddress}`;
  }

  public getIpv6ConnectionString(vm: VirtualMachine): string {
    return `ssh -p ${this.getPort(vm)} -u ${this.getLogin(vm)} ${vm.nic[0].ip6address}`;
  }
}
