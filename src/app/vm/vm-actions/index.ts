import { VmStartActionSilent } from './silent/vm-start-silent';
import { VmStopActionSilent } from './silent/vm-stop-silent';
import { VmChangeServiceOfferingAction } from './vm-change-service-offering';
import { VmConsoleAction } from './vm-console';
import { VmDestroyAction } from './vm-destroy';
import { VmPulseAction } from './vm-pulse';
import { VmRebootAction } from './vm-reboot';
import { VmResetPasswordAction } from './vm-reset-password';
import { VmRestoreAction } from './vm-restore';
import { VmStartAction } from './vm-start';
import { VmStopAction } from './vm-stop';
import { VmWebShellAction } from './vm-webshell';
import { VmURLAction } from './vm-url';

export {
  VmStartAction,
  VmStartActionSilent,
  VmStopAction,
  VmStopActionSilent,
  VmRebootAction,
  VmRestoreAction,
  VmDestroyAction,
  VmResetPasswordAction,
  VmConsoleAction,
  VmWebShellAction,
  VmPulseAction,
  VmChangeServiceOfferingAction,
  VmURLAction,
};

export const VmActionProviders = [
  VmStartAction,
  VmStartActionSilent,
  VmStopAction,
  VmStopActionSilent,
  VmRebootAction,
  VmRestoreAction,
  VmDestroyAction,
  VmResetPasswordAction,
  VmConsoleAction,
  VmWebShellAction,
  VmPulseAction,
  VmChangeServiceOfferingAction,
  VmURLAction,
];
