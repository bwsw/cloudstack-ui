import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCheckbox, MatCheckboxChange, MatDialogModule, MatDialogRef } from '@angular/material';
import { By } from '@angular/platform-browser';
import { MockComponent } from 'ng-mocks';
import { MockTranslatePipe } from '../../../../testutils/mocks/mock-translate.pipe.spec';

import { VmStopDialogComponent } from './vm-stop-dialog.component';

describe('VmStopDialogComponent', () => {
  let component: VmStopDialogComponent;
  let fixture: ComponentFixture<VmStopDialogComponent>;

  let dialogRef;

  const mockCheckbox = MockComponent(MatCheckbox);

  beforeEach(async(() => {
    dialogRef = {
      close: jasmine.createSpy(),
    };

    TestBed.configureTestingModule({
      imports: [MatDialogModule],
      declarations: [VmStopDialogComponent, mockCheckbox, MockTranslatePipe],
      providers: [
        {
          provide: MatDialogRef,
          useValue: dialogRef,
        },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VmStopDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  function findForceCheckbox() {
    return fixture.debugElement.query(By.directive(mockCheckbox));
  }

  function clickNoButton() {
    fixture.debugElement.queryAll(By.css('button'))[0].nativeElement.click();
    fixture.detectChanges();
  }

  function clickYesButton() {
    fixture.debugElement.queryAll(By.css('button'))[1].nativeElement.click();
    fixture.detectChanges();
  }

  function hitEscButton() {
    fixture.debugElement.triggerEventHandler('keydown.esc', {});
    fixture.detectChanges();
  }

  function setCheckboxChecked(checked: boolean) {
    const checkbox = findForceCheckbox().componentInstance;

    const changeEvent = new MatCheckboxChange();
    changeEvent.checked = checked;
    changeEvent.source = checkbox;

    checkbox.checked = checked;
    checkbox.change.emit(changeEvent);

    fixture.detectChanges();
  }

  it('should close dialog when Esc is pressed and return no data', () => {
    hitEscButton();
    expect(dialogRef.close).toHaveBeenCalledTimes(1);
    expect(dialogRef.close).toHaveBeenCalledWith();
  });

  it('should close with an empty result when `No` is clicked', () => {
    clickNoButton();
    expect(dialogRef.close).toHaveBeenCalledWith('');
  });

  it('should set `forced` params to the value of the checkbox', () => {
    setCheckboxChecked(true);
    clickYesButton();
    expect(dialogRef.close).toHaveBeenCalledWith({ forced: true });

    setCheckboxChecked(false);
    clickYesButton();
    expect(dialogRef.close).toHaveBeenCalledWith({ forced: false });
  });
});
