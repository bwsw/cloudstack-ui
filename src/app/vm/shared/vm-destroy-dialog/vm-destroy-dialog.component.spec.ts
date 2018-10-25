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
import { VmDestroyDialogComponent } from './vm-destroy-dialog.component';

describe('VmDestroyDialogComponent', () => {
  let component: VmDestroyDialogComponent;
  let fixture: ComponentFixture<VmDestroyDialogComponent>;
  let dialog: MatDialogRef<VmDestroyDialogComponent>;

  beforeEach(async(() => {
    dialog = jasmine.createSpyObj('MdDialogRef', ['close']);

    TestBed.configureTestingModule({
      imports: [FormsModule, MatCheckboxModule, MatDialogModule],
      declarations: [MockTranslatePipe, VmDestroyDialogComponent],
      providers: [
        {
          provide: MatDialogRef,
          useValue: dialog,
        },
        { provide: MAT_DIALOG_DATA, useValue: true },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VmDestroyDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should display `expunge` checkbox', () => {
    let checkbox = fixture.debugElement.query(By.directive(MatCheckbox));
    expect(checkbox).toBeDefined();

    component.canExpunge = false;
    fixture.detectChanges();

    checkbox = fixture.debugElement.query(By.directive(MatCheckbox));
    expect(checkbox).toBe(null);
  });

  it('should not return any data when `No` is clicked', () => {
    const noButton = fixture.debugElement.queryAll(By.css('button'))[0];
    noButton.nativeElement.click();

    fixture.detectChanges();
    expect(dialog.close).toHaveBeenCalledTimes(1);
    expect(dialog.close).toHaveBeenCalledWith('');
  });

  it('should close dialog when Esc is pressed and return no data', () => {
    fixture.debugElement.triggerEventHandler('keydown.esc', {});

    fixture.detectChanges();
    expect(dialog.close).toHaveBeenCalledTimes(1);
    expect(dialog.close).toHaveBeenCalledWith();
  });

  it('should return selected `expunge` option when `Yes` is clicked', async(async () => {
    expect(component.expunge).toBe(false);
    const yesButton = fixture.debugElement.queryAll(By.css('button'))[1];

    yesButton.nativeElement.click();
    fixture.detectChanges();
    expect(dialog.close).toHaveBeenCalledTimes(1);
    // expunge is false by default, thus omitted (cloudstack quirks)
    expect(dialog.close).toHaveBeenCalledWith({});

    const checkbox = fixture.debugElement.query(By.directive(MatCheckbox));
    checkbox.nativeElement.querySelector('input').click();
    await fixture.whenStable();
    fixture.detectChanges();
    expect(component.expunge).toBe(true);

    yesButton.nativeElement.click();
    fixture.detectChanges();
    expect(dialog.close).toHaveBeenCalledTimes(2);
    expect(dialog.close).toHaveBeenCalledWith({ expunge: true });
  }));
});
