import { VmStartActionSilent } from './silent/vm-start-silent';
import { VmStopActionSilent } from './silent/vm-stop-silent';
import { VmChangeServiceOfferingAction } from './vm-change-service-offering';
import { VmConsoleAction } from './vm-console';
import { VmDestroyAction } from './vm-destroy';
import { VmExpungeAction } from './vm-expunge';
import { VmPulseAction } from './vm-pulse';
import { VmRebootAction } from './vm-reboot';
import { VmRecoverAction } from './vm-recover';
import { VmResetPasswordAction } from './vm-reset-password';
import { VmRestoreAction } from './vm-restore';
import { VmStartAction } from './vm-start';
import { VmStopAction } from './vm-stop';
import { VmWebShellAction } from './vm-webshell';

export {
  VmStartAction,
  VmStartActionSilent,
  VmStopAction,
  VmStopActionSilent,
  VmRebootAction,
  VmRestoreAction,
  VmDestroyAction,
  VmExpungeAction,
  VmRecoverAction,
  VmResetPasswordAction,
  VmConsoleAction,
  VmWebShellAction,
  VmPulseAction,
  VmChangeServiceOfferingAction,
};

export const VmActionProviders = [
  VmStartAction,
  VmStartActionSilent,
  VmStopAction,
  VmStopActionSilent,
  VmRebootAction,
  VmRestoreAction,
  VmDestroyAction,
  VmExpungeAction,
  VmRecoverAction,
  VmResetPasswordAction,
  VmConsoleAction,
  VmWebShellAction,
  VmPulseAction,
  VmChangeServiceOfferingAction,
];
