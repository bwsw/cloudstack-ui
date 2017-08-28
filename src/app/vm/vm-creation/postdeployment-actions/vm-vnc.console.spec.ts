import { inject, TestBed } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { VirtualMachine } from '../../shared/vm.model';
import { VmConsoleAction } from '../../vm-actions/vm-console';
import { VmVncConsoleAction } from './vm-vnc-console';

class MockVmConsoleAction {
  public activate(vm: VirtualMachine): Observable<void> {
    return Observable.of(null);
  }
}

describe('Vm Vnc console action', () => {
  let actionSpy: jasmine.Spy;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: VmConsoleAction, useClass: MockVmConsoleAction },
        VmVncConsoleAction
      ]
    });

    actionSpy = spyOn(MockVmConsoleAction.prototype, 'activate');
  });

  it('should activate only if a VM was created from ISO',
    inject([VmVncConsoleAction], (action: VmVncConsoleAction) => {
      const fakeVm: any = {};
      expect(action.canActivate(fakeVm)).toBe(false);

      fakeVm.isoId = 'someId';
      expect(action.canActivate(fakeVm)).toBe(true);
    })
  );

  it(
    'should activate VmConsoleAction',
    inject([VmVncConsoleAction], (action: VmVncConsoleAction) => {
      const fakeVm: any = {};
      action.activate(fakeVm);
      expect(actionSpy).toHaveBeenCalledTimes(1);
    })
  );
});
