import {
  VirtualMachine,
  VmState
} from '../shared/vm.model';

const AuthModeToken = 'csui.vm.auth-mode';
const protocolToken = 'csui.vm.http.protocol';
const portToken = 'csui.vm.http.port';
const pathToken = 'csui.vm.http.path';
const loginToken = 'csui.vm.http.login';
const passwordToken = 'csui.vm.http.password';

enum AuthModeType {
  HTTP = 'http'
}

const getPort = (vm: VirtualMachine) => {
  const portTag = vm.tags.find(tag => tag.key === portToken);
  return portTag && portTag.value || '80';
};
const getPath = (vm: VirtualMachine) => {
  const pathTag = vm.tags.find(tag => tag.key === pathToken);
  return pathTag && pathTag.value;
};
const getProtocol = (vm: VirtualMachine) => {
  const protocolTag = vm.tags.find(tag => tag.key === protocolToken);
  return protocolTag && protocolTag.value || 'http';
};

export const VmURLAction = {

  activate: (vm: VirtualMachine) => {
    const protocol = getProtocol(vm);
    const port = getPort(vm);
    const path = getPath(vm);
    const ip = vm.nic[0].ipAddress;

    const address = `${protocol}://${ip}:${port}${path}`;
    window.open(
      address,
      vm.displayName,
      'resizable=0,width=820,height=640'
    );
  },
  canActivate: (vm: VirtualMachine) => {
    const authModeTag = vm.tags.find(tag => tag.key === AuthModeToken);
    const authMode = authModeTag && authModeTag.value;
    const mode = authMode && authMode.split(',').find(mode => mode === AuthModeType.HTTP);
    return mode && vm.state === VmState.Running;
  },
  hidden: () => false,

  getLogin: (vm: VirtualMachine) => {
    const loginTag = vm.tags.find(tag => tag.key === loginToken);
    return loginTag && loginTag.value;
  },

  getPassword: (vm: VirtualMachine) => {
    const passwordTag = vm.tags.find(tag => tag.key === passwordToken);
    return passwordTag && passwordTag.value;
  }
};
