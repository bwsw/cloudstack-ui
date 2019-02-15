import { VirtualMachine } from '../';
import { Tag } from '../../shared/models';

export enum AuthModeType {
  SSH = 'ssh',
  HTTP = 'http',
  VNC = 'vnc',
}

export abstract class AccessService {
  protected readonly authMode: AuthModeType;
  protected readonly defaultLogin = 'root';

  public openWindow(vm: VirtualMachine, target: string = this.authMode) {
    const address = this.getAddress(vm);
    const params =
      target === this.authMode ? 'resizable=0,toolbar=no,menubar=no,width=820,height=640' : '';
    window.open(address, target, params);
  }

  public abstract getLogin(vm: VirtualMachine): string;

  public abstract getPassword(vm: VirtualMachine): string;

  protected getTagValue(tags: Tag[], key: string): string | undefined {
    const foundTag = tags.find(tag => tag.key === key);
    return foundTag && foundTag.value;
  }

  protected abstract getAddress(vm: VirtualMachine);
}
