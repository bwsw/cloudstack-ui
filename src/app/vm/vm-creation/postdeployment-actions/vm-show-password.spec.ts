import { inject, TestBed } from '@angular/core/testing';
import { MockDialogService } from '../../../../testutils/mocks/mock-dialog.service';
import { DialogService } from '../../../dialog/dialog-service/dialog.service';
import { VmShowPasswordAction } from './vm-show-password';


describe('Vm show password action', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: DialogService, useClass: MockDialogService },
        VmShowPasswordAction
      ]
    });
  });

  it('should activate only if a VM is password enabled',
    inject([VmShowPasswordAction], (action: VmShowPasswordAction) => {
      const fakeVm: any = {};
      fakeVm.passwordEnabled = false;
      expect(action.canActivate(fakeVm)).toBe(false);

      fakeVm.passwordEnabled = true;
      expect(action.canActivate(fakeVm)).toBe(true);
    })
  );

  it(
    'should show dialog with password',
    inject([VmShowPasswordAction], (action: VmShowPasswordAction) => {
      const spy = spyOn(MockDialogService.prototype, 'alert');
      const fakeVm: any = {};
      action.activate(fakeVm);
      expect(spy).toHaveBeenCalledTimes(1);
    })
  );
});
