import { VirtualMachineTagKeys } from '../../shared/services/tags/vm-tag-keys';
import { Injectable } from '@angular/core';
import { VirtualMachine } from '../';
import { AccessService, AuthModeType } from './access.service';


@Injectable()
export class HttpAccessService extends AccessService {
  protected readonly authMode = AuthModeType.HTTP;
  private readonly defaultHttpPort = '80';
  private readonly defaultHttpsPort = '443';
  private readonly defaultProtocol = 'http';
  private readonly defaultPath = '';

  public getAddress(vm: VirtualMachine): string {
    const protocol = this.getHttpProtocol(vm);
    const port = this.getHttpPort(vm);
    const path = this.getHttpPath(vm);
    const ip = vm.nic[0].ipaddress;
    return `${protocol}://${ip}:${port}/${path}`;
  }

  public isHttpAuthMode(vm: VirtualMachine): boolean {
    const authMode = this.getTagValue(vm.tags, VirtualMachineTagKeys.authModeToken);
    if (authMode) {
      const authModes = authMode.replace(/\s/g, '').split(',');
      return !!authModes.find(m => m.toLowerCase() === this.authMode);
    }
    return false;
  }

  public getLogin(vm: VirtualMachine): string {
    const httpLogin = this.getTagValue(vm.tags, VirtualMachineTagKeys.httpLoginToken);
    const vmLogin = this.getTagValue(vm.tags, VirtualMachineTagKeys.loginTag);
    return httpLogin || vmLogin || this.defaultLogin;
  }

  public getPassword(vm: VirtualMachine): string {
    const passwordTag = this.getTagValue(vm.tags, VirtualMachineTagKeys.httpPasswordToken);
    const vmPassword = this.getTagValue(vm.tags, VirtualMachineTagKeys.passwordTag);
    return passwordTag || vmPassword;
  }

  public getHttpProtocol(vm: VirtualMachine) {
    const protocolTag = this.getTagValue(vm.tags, VirtualMachineTagKeys.httpProtocolToken);
    return protocolTag.toLowerCase() || this.defaultProtocol;
  };

  public getHttpPath(vm: VirtualMachine) {
    const pathTag = this.getTagValue(vm.tags, VirtualMachineTagKeys.httpPathToken);
    return pathTag.toLowerCase() || this.defaultPath;
  };

  public getHttpPort(vm: VirtualMachine) {
    const portTag = this.getTagValue(vm.tags, VirtualMachineTagKeys.httpPortToken);
    if (portTag) {
      return portTag;
    }
    const defaultValue = this.getHttpProtocol(vm) === this.defaultProtocol ? this.defaultHttpPort : this.defaultHttpsPort;
    return defaultValue;
  }
}
