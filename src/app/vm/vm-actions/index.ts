import { VmPulseAction } from './vm-pulse';
import { VmWebShellAction } from './vm-webshell';
import { VmSavePasswordAction } from './vm-save-password';
import { VmAccessAction } from './vm-access';

export {
  VmWebShellAction,
  VmPulseAction,
  VmSavePasswordAction,
  VmAccessAction
};

export const VmActionProviders = [
  VmWebShellAction,
  VmPulseAction,
  VmSavePasswordAction,
  VmAccessAction
];
