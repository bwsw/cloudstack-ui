import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatCheckbox,
  MatCheckboxModule,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material';
import { By } from '@angular/platform-browser';

import { MockTranslatePipe } from '../../../../testutils/mocks/mock-translate.pipe.spec';
import { ValueEqualToValidatorDirective } from './value-equal-to-validator.directive';
import { VmDestroyDialogComponent, VmDestroyDialogData } from './vm-destroy-dialog.component';

const vms = require('../../../../testutils/mocks/model-services/fixtures/vms.json');

describe('VmDestroyDialogComponent', () => {
  let component: VmDestroyDialogComponent;
  let fixture: ComponentFixture<VmDestroyDialogComponent>;
  let dialog: MatDialogRef<VmDestroyDialogComponent>;

  const defaultDialogData = {
    vm: vms[0],
    canExpungeOrRecoverVm: true,
  };

  function createFixture(dialogData?: Partial<VmDestroyDialogData>) {
    if (fixture) {
      fixture.destroy();
      TestBed.resetTestingModule();
      component = null;
      fixture = null;
    }

    dialog = jasmine.createSpyObj('MdDialogRef', ['close']);

    TestBed.configureTestingModule({
      imports: [FormsModule, MatCheckboxModule, MatDialogModule],
      declarations: [MockTranslatePipe, VmDestroyDialogComponent, ValueEqualToValidatorDirective],
      providers: [
        {
          provide: MatDialogRef,
          useValue: dialog,
        },
        { provide: MAT_DIALOG_DATA, useValue: { ...defaultDialogData, ...dialogData } },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
    fixture = TestBed.createComponent(VmDestroyDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }

  beforeEach(async(() => {
    createFixture();
  }));

  function findExpungeDbgEl() {
    return fixture.debugElement.query(By.directive(MatCheckbox));
  }

  function clickNoButton() {
    fixture.debugElement.queryAll(By.css('button'))[0].nativeElement.click();
    fixture.detectChanges();
  }

  function hitEscButton() {
    fixture.debugElement.triggerEventHandler('keydown.esc', {});
    fixture.detectChanges();
  }

  it('should display `expunge` checkbox if the user is allowed to expunge or recover vm', () => {
    createFixture({ canExpungeOrRecoverVm: true });
    expect(findExpungeDbgEl()).not.toBeNull();

    createFixture({ canExpungeOrRecoverVm: false });
    expect(findExpungeDbgEl()).toBeNull();
  });

  it('should not return any data when `No` is clicked', () => {
    clickNoButton();
    expect(dialog.close).toHaveBeenCalledTimes(1);
    expect(dialog.close).toHaveBeenCalledWith('');
  });

  it('should close dialog when Esc is pressed and return no data', () => {
    hitEscButton();
    expect(dialog.close).toHaveBeenCalledTimes(1);
    expect(dialog.close).toHaveBeenCalledWith();
  });

  describe('form submission', () => {
    function clickExpunge() {
      findExpungeDbgEl()
        .nativeElement.querySelector('input')
        .click();
      fixture.detectChanges();
    }

    function clickYesButton() {
      fixture.debugElement.queryAll(By.css('button'))[1].nativeElement.click();
      fixture.detectChanges();
    }

    function findExpectedUUID() {
      // Would be more robust to grab the ID from the HTML,
      // but it is not included in these tests because the `translate`
      // pipe is mocked.
      // Keeping it like that for now.
      return component.vmIdSlice;
    }

    async function enterUUID(value: string) {
      const inputEl = fixture.nativeElement.querySelector('input[name="confirm-id"]');
      inputEl.value = value;
      inputEl.dispatchEvent(new UIEvent('input'));
      fixture.detectChanges();
      await fixture.whenStable();
      fixture.detectChanges();
    }

    it('should not allow submitting the form if vm UUID is not confirmed', async () => {
      await enterUUID('');
      clickYesButton();
      expect(dialog.close).not.toHaveBeenCalled();

      await enterUUID('definitely not a vm UUID');
      clickYesButton();
      expect(dialog.close).not.toHaveBeenCalled();
    });

    it('should allow submitting the form with the expected UUID', async () => {
      await enterUUID(findExpectedUUID());
      clickYesButton();
      expect(dialog.close).toHaveBeenCalled();
    });

    it('should include selected `expunge` option into the dialog result', async () => {
      await enterUUID(findExpectedUUID());

      clickExpunge(); // should be checked
      clickYesButton();
      expect(dialog.close).toHaveBeenCalledWith({ expunge: true });

      clickExpunge(); // should be unchecked
      clickYesButton();
      expect(dialog.close).toHaveBeenCalledWith({}); // expunge is false by default, thus omitted (cloudstack quirks)
    });
  });
});
