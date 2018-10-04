import { VirtualMachineTagKeys } from '../../shared/services/tags/vm-tag-keys';
import { Injectable } from '@angular/core';
import { VirtualMachine } from '../';
import { AccessService, AuthModeType } from './access.service';


@Injectable()
export class HttpAccessService extends AccessService {
  protected readonly authMode = AuthModeType.HTTP;

  readonly defaultHTTPPort = '80';
  readonly defaultHTTPSPort = '443';
  readonly defaultProtocol = 'http';
  readonly defaultPath = '';
  readonly defaultLogin = 'root';


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

  public getHttpLogin(vm: VirtualMachine) {
    return this.getTagValue(vm.tags, VirtualMachineTagKeys.httpLoginToken) || this.defaultLogin;
  }

  public getHttpPassword(vm: VirtualMachine) {
    return this.getTagValue(vm.tags, VirtualMachineTagKeys.httpPasswordToken)
  }

  public getHttpProtocol(vm: VirtualMachine) {
    const protocolTag = this.getTagValue(vm.tags, VirtualMachineTagKeys.httpProtocolToken);
    return protocolTag || this.defaultProtocol;
  };

  public getHttpPath(vm: VirtualMachine) {
    const pathTag = this.getTagValue(vm.tags, VirtualMachineTagKeys.httpPathToken);
    return pathTag || this.defaultPath;
  };

  public getHttpPort(vm: VirtualMachine) {
    const portTag = this.getTagValue(vm.tags, VirtualMachineTagKeys.httpPortToken);
    if (portTag) {
      return portTag;
    }
    const defaultValue = this.getHttpProtocol(vm) === 'http' ? this.defaultHTTPPort : this.defaultHTTPSPort;
    return defaultValue;
  }

}
