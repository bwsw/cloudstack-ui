import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Store } from '@ngrx/store';

import { VmUserDataDialogComponent } from './vm-user-data-dialog.component';
import { MockTranslatePipe } from '../../../../../testutils/mocks/mock-translate.pipe.spec';
import { vm } from '../../../../../testutils/data';
import { TestStore } from '../../../../../testutils/ngrx-test-store';
import { ChangeVmUserData } from '../../../../reducers/vm/redux/vm.actions';
import { State } from '../../../../root-store';
import { DialogService } from '../../../../dialog/dialog-service/dialog.service';

describe('VmUserDataDialogComponent', () => {
  let component: VmUserDataDialogComponent;
  let fixture: ComponentFixture<VmUserDataDialogComponent>;
  let store: TestStore<State>;
  let dialogServce: jasmine.SpyObj<DialogService>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule],
      declarations: [VmUserDataDialogComponent, MockTranslatePipe],
      providers: [
        {
          provide: MatDialogRef,
          useValue: jasmine.createSpyObj('MdDialogRef', ['close']),
        },
        {
          provide: DialogService,
          useValue: jasmine.createSpyObj('DialogService', ['alert']),
        },
        {
          provide: MAT_DIALOG_DATA,
          useValue: vm,
        },
        {
          provide: Store,
          useClass: TestStore,
        },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    store = TestBed.get(Store);
    dialogServce = TestBed.get(DialogService);
    fixture = TestBed.createComponent(VmUserDataDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should change to edit mode', () => {
    component.onEdit();
    expect(component.isEditMode).toBeTruthy();
    expect(component.form.controls['userdata'].enabled).toBeTruthy();
  });

  describe('onSubmit', () => {
    it('should dispatch ChangeVmUserData and then change edit mode', () => {
      const userdata = 'new user data';
      const spy = spyOn(store, 'dispatch');
      // change to edit mode
      component.onEdit();
      component.form.patchValue({ userdata });
      component.onSubmit();

      expect(spy).toHaveBeenCalledWith(new ChangeVmUserData({ vm, userdata }));
      expect(component.isEditMode).toBeFalsy();
      expect(component.form.controls['userdata'].disabled).toBeTruthy();
    });

    it('should show alert dialog when userdata too big', () => {
      const userdata = 'new user data'.repeat(1800);
      // change to edit mode
      component.onEdit();
      component.form.patchValue({ userdata });
      component.onSubmit();
      expect(dialogServce.alert).toHaveBeenCalledWith({ message: 'ERRORS.VM.USER_DATA_TOO_BIG' });
    });
  });
});
