import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material';
import { Store } from '@ngrx/store';
import { MockDirective, MockHelper } from 'ng-mocks';
import { NEVER, of } from 'rxjs';
import { VirtualMachine, VmState } from '../../..';
import { MockTranslatePipe } from '../../../../../testutils/mocks/mock-translate.pipe.spec';
import { osTypes } from '../../../../../testutils/mocks/model-services/fixtures/os-types';
import { TestStore } from '../../../../../testutils/ngrx-test-store';
import { ChangeOsType } from '../../../../reducers/vm/redux/vm.actions';
import { LoadingDirective } from '../../../../shared/directives';
import { OsTypeService } from '../../../../shared/services/os-type.service';
import { OsTypeDialogComponent } from './os-type-selector/os-type-dialog.component';

import { OsTypeComponent } from './os-type.component';

describe('OsTypeComponent', () => {
  let component: OsTypeComponent;
  let fixture: ComponentFixture<OsTypeComponent>;

  const mockLoadingDirective = MockDirective(LoadingDirective);

  let dialog;
  let osTypeService;
  let store;

  const vm: VirtualMachine = require('../../../../../testutils/mocks/model-services/fixtures/vms.json');

  beforeEach(async(() => {
    dialog = {
      open: jasmine.createSpy(),
    };
    osTypeService = {
      get: jasmine.createSpy().and.returnValue(of(osTypes[0])),
    };
    store = new TestStore();
    spyOn(store, 'dispatch');

    TestBed.configureTestingModule({
      declarations: [OsTypeComponent, MockTranslatePipe, mockLoadingDirective],
      providers: [
        {
          provide: MatDialog,
          useValue: dialog,
        },
        {
          provide: OsTypeService,
          useValue: osTypeService,
        },
        { provide: Store, useValue: store },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OsTypeComponent);
    component = fixture.componentInstance;
    component.vm = vm;
    fixture.detectChanges();
  });

  function findOsType() {
    return fixture.nativeElement.querySelector('.mat-card-content-container').textContent.trim();
  }

  function hasLoading() {
    return !!MockHelper.findDirective(fixture.debugElement, LoadingDirective);
  }

  function findEditButton(): HTMLButtonElement {
    return fixture.nativeElement.querySelector('button');
  }

  it('should display os type of vm', () => {
    expect(osTypeService.get).toHaveBeenCalledWith(vm.guestosid);
    expect(findOsType()).toBe(osTypes[0].description);
    expect(hasLoading()).toBe(false);
  });

  it('should display loading indicator if os type is not ready', () => {
    osTypeService.get.and.returnValue(NEVER);

    fixture.destroy();
    fixture = TestBed.createComponent(OsTypeComponent);
    component = fixture.componentInstance;
    component.vm = vm;
    fixture.detectChanges();
    expect(hasLoading()).toBe(true);
  });

  it('should disable edit button if vm is in pending state', () => {
    component.vm = { ...vm, state: VmState.InProgress };
    fixture.detectChanges();
    expect(findEditButton().disabled).toBe(true);

    component.vm = { ...vm, state: VmState.Stopped };
    fixture.detectChanges();
    expect(findEditButton().disabled).toBe(false);
  });

  describe('edit dialog', () => {
    function clickEditButton() {
      findEditButton().click();
      fixture.detectChanges();
    }

    function setNextDialogResult(result) {
      dialog.open.and.returnValue({ afterClosed: () => of(result) });
    }

    beforeEach(() => {
      setNextDialogResult(undefined);
    });

    it('should open the dialog when edit button is clicked', () => {
      clickEditButton();
      expect(dialog.open).toHaveBeenCalledWith(OsTypeDialogComponent, {
        width: '400px',
        data: { vm },
      });
    });

    it('should ignore empty dialog result', () => {
      setNextDialogResult(undefined);
      clickEditButton();
      expect(store.dispatch).not.toHaveBeenCalled();
    });

    it('should dispatch when new os type id is selected in the dialog', () => {
      setNextDialogResult(osTypes[1].id);
      clickEditButton();
      expect(store.dispatch).toHaveBeenCalledWith(
        new ChangeOsType({ osTypeId: osTypes[1].id, vm }),
      );
    });
  });
});
