import { ConfigService } from '../../core/services';
import { VirtualMachineTagKeys } from '../../shared/services/tags/vm-tag-keys';
import { Injectable } from '@angular/core';

enum AuthModeType {
  HTTP = 'http'
}

const defaultPort = '80';
const defaultProtocol = 'http';
const defaultPath = '';

@Injectable()
export class HttpModeService {

  public static getAddress(vm): string {
    const getHttpPort = (machine) => {
      const portTag = machine.tags.find(tag => tag.key === VirtualMachineTagKeys.httpPortToken);
      return portTag && portTag.value || defaultPort;
    };

    const getHttpPath = (machine) => {
      const pathTag = machine.tags.find(tag => tag.key === VirtualMachineTagKeys.httpPathToken);
      return pathTag && pathTag.value || defaultPath;
    };

    const getHttpProtocol = (machine) => {
      const protocolTag = machine.tags.find(
        tag => tag.key === VirtualMachineTagKeys.httpProtocolToken);
      return protocolTag && protocolTag.value || defaultProtocol;
    };

    const protocol = getHttpProtocol(vm);
    const port = getHttpPort(vm);
    const path = getHttpPath(vm);
    const ip = vm.nic[0].ipaddress;
    return `${protocol}://${ip}:${port}/${path}`;
  }

  public static isHttpAuthMode(machine) {
    const authModeTag = machine.tags.find(
      tag => tag.key === VirtualMachineTagKeys.authModeToken);
    const authMode = authModeTag && authModeTag.value;
    const mode = authMode && authMode.replace(/\s/g, '').split(',').find(m => m.toLowerCase() === AuthModeType.HTTP);
    return mode && machine.state === 'Running';
  }

  public static getHttpLogin(machine) {
    const loginTag = machine.tags.find(tag => tag.key === VirtualMachineTagKeys.httpLoginToken);
    return loginTag && loginTag.value;
  }

  public static getHttpPassword(machine) {
    const passwordTag = machine.tags.find(
      tag => tag.key === VirtualMachineTagKeys.httpPasswordToken);
    return passwordTag && passwordTag.value;
  }

  constructor(public configService: ConfigService) {
  }
}
