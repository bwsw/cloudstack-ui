import { inject, TestBed } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { MockDialogService } from '../../../../testutils/mocks/mock-dialog.service';
import { DialogService } from '../../../dialog/dialog-service/dialog.service';
import { VirtualMachine } from '../../shared/vm.model';
import { VmConsoleAction } from '../../vm-actions/vm-console';
import { VmShowPasswordAction } from '../postdeployment-actions/vm-show-password';
import { VmVncConsoleAction } from '../postdeployment-actions/vm-vnc-console';
import { VmPostdeploymentActionsService } from './vm-postdeployment-actions.service';


class MockVmConsoleAction {
  public activate(vm: VirtualMachine): Observable<void> {
    return Observable.of(null);
  }
}

describe('Vm Vnc console action', () => {
  let consoleSpy: jasmine.Spy;
  let passwordSpy: jasmine.Spy;

  beforeEach(() => {
    consoleSpy = spyOn(VmVncConsoleAction.prototype, 'activate');
    passwordSpy = spyOn(VmShowPasswordAction.prototype, 'activate');

    TestBed.configureTestingModule({
      providers: [
        { provide: VmConsoleAction, useClass: MockVmConsoleAction },
        { provide: DialogService, useClass: MockDialogService },
        VmShowPasswordAction,
        VmVncConsoleAction,
        VmPostdeploymentActionsService
      ]
    });
  });

  it(
    'should select vm console action if vm was created from ISO',
    inject(
      [VmPostdeploymentActionsService],
      (service: VmPostdeploymentActionsService) => {
        const fakeVm: any = { isoId: 'someId' };

        service.run(fakeVm);
        expect(consoleSpy).toHaveBeenCalledTimes(1);
        expect(passwordSpy).toHaveBeenCalledTimes(0);
      }
    )
  );

  it(
    'should select vm show password action if vm is password enabled',
    inject(
      [VmPostdeploymentActionsService],
      (service: VmPostdeploymentActionsService) => {
        const fakeVm: any = { passwordEnabled: true };

        service.run(fakeVm);
        expect(consoleSpy).toHaveBeenCalledTimes(0);
        expect(passwordSpy).toHaveBeenCalledTimes(1);
      }
    )
  );
});
