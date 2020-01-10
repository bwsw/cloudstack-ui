import { DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogClose, MatOption, MatSelect } from '@angular/material';
import { By } from '@angular/platform-browser';
import { MockComponent, MockDirective, MockedComponent, MockedDirective } from 'ng-mocks';
import { of } from 'rxjs';
import { VirtualMachine, VmState } from '../../../..';
import { MockTranslatePipe } from '../../../../../../testutils/mocks/mock-translate.pipe.spec';
import { osTypes } from '../../../../../../testutils/mocks/model-services/fixtures/os-types';
import { OsTypeService } from '../../../../../shared/services/os-type.service';

import { OsTypeDialogComponent } from './os-type-dialog.component';

describe('OsTypeDialogComponent', () => {
  let component: OsTypeDialogComponent;
  let fixture: ComponentFixture<OsTypeDialogComponent>;

  let osTypeService;

  const vm: VirtualMachine = require('../../../../../../testutils/mocks/model-services/fixtures/vms.json')[0];

  const mockMatSelect = MockComponent(MatSelect);
  const mockMatOption = MockComponent(MatOption);
  const mockDialogClose = MockDirective(MatDialogClose);

  beforeEach(async(() => {
    osTypeService = {
      getList: jasmine.createSpy().and.returnValue(of(osTypes)),
    };
  }));

  function configureModuleWithVmStatus(state: VmState) {
    if (fixture) {
      fixture.destroy();
      component = null;
    }
    TestBed.resetTestingModule();

    TestBed.configureTestingModule({
      declarations: [
        OsTypeDialogComponent,
        mockMatSelect,
        mockMatOption,
        mockDialogClose,
        MockTranslatePipe,
      ],
      providers: [
        { provide: OsTypeService, useValue: osTypeService },
        { provide: MAT_DIALOG_DATA, useValue: { vm: { ...vm, state } } },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(OsTypeDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }

  function findSelect(): MockedComponent<MatSelect> {
    return fixture.debugElement.query(By.directive(mockMatSelect)).componentInstance;
  }

  function findOptionsEls(): DebugElement[] {
    return fixture.debugElement.queryAll(By.directive(mockMatOption));
  }

  function setSelectValue(value: string) {
    findSelect().value = value;
    findSelect().valueChange.emit(value);
    fixture.detectChanges();
  }

  describe('basic', () => {
    beforeEach(() => {
      configureModuleWithVmStatus(VmState.Running);
    });

    it('should set initial value', () => {
      expect(component.initialOsTypeId).toBe(vm.guestosid);
      expect(component.osTypeId).toBe(vm.guestosid);
    });

    it('should display options', () => {
      const optionsEls = findOptionsEls();
      const options: MockedComponent<MatOption>[] = optionsEls.map(el => el.componentInstance);

      expect(optionsEls.length).toBe(osTypes.length);
      expect(options.map(op => op.value)).toEqual(osTypes.map(t => t.id));
      optionsEls.forEach((el, i) =>
        expect(el.nativeElement.textContent.trim()).toBe(osTypes[i].description),
      );
    });

    it('should update select os type id', () => {
      setSelectValue(osTypes[0].id);
      expect(component.osTypeId).toBe(osTypes[0].id);

      setSelectValue(osTypes[1].id);
      expect(component.osTypeId).toBe(osTypes[1].id);
    });
  });

  describe('reboot warning', () => {
    function findWarning(): HTMLElement | null {
      return fixture.nativeElement.querySelector('.warning');
    }

    it('should display the warning when value has changed and vm is running', () => {
      configureModuleWithVmStatus(VmState.Running);

      setSelectValue(component.initialOsTypeId);
      expect(findWarning()).toBeNull(); // value hasn't changed

      setSelectValue(osTypes[0].id);
      expect(findWarning()).not.toBeNull();
    });

    it('should not show any warnings if the vm is not running', () => {
      configureModuleWithVmStatus(VmState.Stopped);

      setSelectValue(component.initialOsTypeId);
      expect(findWarning()).toBeNull();
      setSelectValue(osTypes[0].id);
      expect(findWarning()).toBeNull();
    });
  });

  describe('dialog results', () => {
    function findDialogClose(): MockedDirective<MatDialogClose>[] {
      return fixture.debugElement
        .queryAll(By.css('button'))
        .map(el => el.injector.get(mockDialogClose));
    }

    function getResult(dir: MockedDirective<MatDialogClose>) {
      return dir._matDialogClose;
    }

    function getCancelResult() {
      return getResult(findDialogClose()[0]);
    }

    function getSaveResult() {
      return getResult(findDialogClose()[1]);
    }

    beforeEach(() => {
      configureModuleWithVmStatus(VmState.Running);
    });

    it('should have no result on the cancel button', () => {
      expect(getCancelResult()).toBe('');
    });

    it('should have osTypeId as the dialog result on the Save button', () => {
      setSelectValue(osTypes[0].description);
      expect(getSaveResult()).toBe(component.osTypeId);
    });
  });
});
