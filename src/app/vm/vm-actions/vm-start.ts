import { VirtualMachineAction, VmActions } from './vm-action';
import { VmStates } from '../shared/vm.model';


export class VmStartAction extends VirtualMachineAction {
  public action = VmActions.START;
  public name = 'START';
  public icon = 'play_arrow';

  public tokens = {
    name: 'Start',
    commandName: 'start',
    nameLower: 'start',
    nameCaps: 'START',
    vmStateOnAction: 'START_IN_PROGRESS',
    vmActionCompleted: 'START_DONE',
    confirmMessage: 'CONFIRM_VM_START',
    progressMessage: 'VM_START_IN_PROGRESS',
    successMessage: 'START_DONE'
  };

  public canActivate(): boolean {
    return this.vm.state === VmStates.Stopped;
  }
}
