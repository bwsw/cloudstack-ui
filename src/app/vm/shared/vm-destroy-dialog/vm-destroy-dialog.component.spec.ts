import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MD_DIALOG_DATA, MdCheckbox, MdCheckboxModule, MdDialogModule, MdDialogRef } from '@angular/material';
import { By } from '@angular/platform-browser';

import { MockTranslatePipe } from '../../../../testutils/mocks/mock-translate.pipe.spec';
import { VmDestroyDialogComponent } from './vm-destroy-dialog.component';

describe('VmDestroyDialogComponent', () => {
  let component: VmDestroyDialogComponent;
  let fixture: ComponentFixture<VmDestroyDialogComponent>;
  let dialog: MdDialogRef<VmDestroyDialogComponent>;

  beforeEach(
    async(() => {
      dialog = jasmine.createSpyObj('MdDialogRef', ['close']);

      TestBed.configureTestingModule({
        imports: [FormsModule, MdCheckboxModule, MdDialogModule],
        declarations: [MockTranslatePipe, VmDestroyDialogComponent],
        providers: [
          {
            provide: MdDialogRef,
            useValue: dialog
          },
          { provide: MD_DIALOG_DATA, useValue: true }
        ]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(VmDestroyDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should display `expunge` checkbox', () => {
    let checkbox = fixture.debugElement.query(By.directive(MdCheckbox));
    expect(checkbox).toBeDefined();

    component.canExpunge = false;
    fixture.detectChanges();

    checkbox = fixture.debugElement.query(By.directive(MdCheckbox));
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


    const checkbox = fixture.debugElement.query(By.directive(MdCheckbox));
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
