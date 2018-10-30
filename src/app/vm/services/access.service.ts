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

  public openWindow(vm: VirtualMachine) {
    const address = this.getAddress(vm);
    window.open(address, this.authMode, 'resizable=0,width=820,height=640');
  }

  public abstract getLogin(vm: VirtualMachine): string;

  public abstract getPassword(vm: VirtualMachine): string;

  protected getTagValue(tags: Tag[], key: string): string | undefined {
    const foundTag = tags.find(tag => tag.key === key);
    return foundTag && foundTag.value;
  }

  protected abstract getAddress(vm: VirtualMachine);
}
