import { DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogClose } from '@angular/material';
import { By } from '@angular/platform-browser';
import { MockDirective } from 'ng-mocks';
import { MockTranslatePipe } from '../../../../testutils/mocks/mock-translate.pipe.spec';

import { VmRestoreDialogComponent } from './vm-restore-dialog.component';

describe('VmRestoreDialogComponent', () => {
  let component: VmRestoreDialogComponent;
  let fixture: ComponentFixture<VmRestoreDialogComponent>;

  const mockMatDialogClose = MockDirective(MatDialogClose);

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [VmRestoreDialogComponent, MockTranslatePipe, mockMatDialogClose],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

  function findContent(): HTMLElement {
    return fixture.nativeElement.querySelector('.mat-dialog-content');
  }

  beforeEach(() => {
    fixture = TestBed.createComponent(VmRestoreDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  function findButtonEls(): DebugElement[] {
    return fixture.debugElement.queryAll(By.css('.mat-dialog-actions button'));
  }

  it('should display reinstall confirmation', () => {
    expect(findContent().textContent.trim()).toBe('DIALOG_MESSAGES.VM.CONFIRM_RESTORE');
  });

  it('should display confirmation actions', () => {
    const buttonEls = findButtonEls();
    expect(buttonEls.length).toBe(2);
    expect(buttonEls[0].nativeElement.textContent).toContain('COMMON.NO');
    expect(buttonEls[1].nativeElement.textContent).toContain('COMMON.YES');

    const dialogCloseResults = buttonEls.map(
      el => el.injector.get(mockMatDialogClose)._matDialogClose,
    );
    expect(dialogCloseResults[0]).toBe('');
    expect(dialogCloseResults[1]).toBe(true);
  });
});
