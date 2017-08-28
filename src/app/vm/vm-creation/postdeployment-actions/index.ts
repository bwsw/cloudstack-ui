import { VmShowPasswordAction } from './vm-show-password';
import { VmVncConsoleAction } from './vm-vnc-console';

export const VmPostdeploymentActionProviders = [VmVncConsoleAction, VmShowPasswordAction];
