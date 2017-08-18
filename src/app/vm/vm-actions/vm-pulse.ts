import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { DialogService } from '../../dialog/dialog-module/dialog.service';
import { ConfigService } from '../../shared/services/config.service';
import { JobsNotificationService } from '../../shared/services/jobs-notification.service';
import { VirtualMachine } from '../shared/vm.model';
import { VmService } from '../shared/vm.service';
import { VirtualMachineAction, VmActions } from './vm-action';

@Injectable()
export class VmPulseAction extends VirtualMachineAction {
  public action = VmActions.CONSOLE;
  public name = 'PULSE.PULSE';
  public icon = 'timeline';

  constructor(
    dialogService: DialogService,
    jobsNotificationService: JobsNotificationService,
    vmService: VmService,
    private configService: ConfigService,
    private router: Router,
    private activeRoute: ActivatedRoute
  ) {
    super(dialogService, jobsNotificationService, vmService);
  }

  public canActivate(vm: VirtualMachine): boolean {
    return true;
  }

  public activate(vm: VirtualMachine): Observable<void> {
    this.router.navigate(['instances/pulse', { outlets: {
      'pulse': [vm.id]
    }}], {
      relativeTo: this.activeRoute,
      queryParamsHandling: 'preserve'
    });

    return Observable.of(null);
  }

  public hidden(): boolean {
    const extensions = this.configService.get('extensions');
    return !(extensions && extensions.pulse);
  }
}
