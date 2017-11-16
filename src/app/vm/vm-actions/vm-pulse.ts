import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Observable } from 'rxjs/Observable';
import { VmPulseComponent } from '../../pulse/vm-pulse/vm-pulse.component';
import { ConfigService } from '../../shared/services/config.service';
import {
  VirtualMachine,
  VmState
} from '../shared/vm.model';

@Injectable()
export class VmPulseAction {
  public name = 'PULSE.PULSE';
  public icon = 'timeline';

  constructor(
    private dialog: MatDialog,
    private configService: ConfigService
  ) { }

  public canActivate(vm: VirtualMachine): boolean {
    return !!vm && vm.state === VmState.Running;
  }

  public activate(vm: VirtualMachine): Observable<void> {
    this.dialog.open(VmPulseComponent, { data: vm.id });

    return Observable.of(null);
  }

  public hidden(): boolean {
    const extensions = this.configService.get('extensions');
    return !(extensions && extensions.pulse);
  }
}
