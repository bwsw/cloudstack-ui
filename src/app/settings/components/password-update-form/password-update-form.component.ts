import { ChangeDetectionStrategy, Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { ErrorStateMatcher } from '@angular/material';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormGroupDirective,
  NgForm,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';

export const matchPassword: ValidatorFn = (control: FormGroup): ValidationErrors | null => {
  const valid = control.get('password').value === control.get('passwordRepeat').value;
  return valid ? null : { matchPassword: false };
};

export class PasswordErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl, form: FormGroupDirective | NgForm): boolean {
    const field1 = form.control.get('password');
    const field2 = form.control.get('passwordRepeat');

    return form.invalid && field1.dirty && field1.touched && field2.dirty && field2.touched;
  }
}

@Component({
  selector: 'cs-password-update-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './password-update-form.component.html',
  styleUrls: ['./password-update-form.component.scss'],
})
export class PasswordUpdateFormComponent {
  // Workaround for resetting form state. https://github.com/angular/material2/issues/4190
  // We need manually reset FormGroupDirective via resetForm() method otherwise,
  // the form will be invalid and errors are shown
  @ViewChild(FormGroupDirective)
  myForm;
  @Output()
  passwordChange = new EventEmitter<string>();
  public passwordForm: FormGroup;
  public errorStateMatcher = new PasswordErrorStateMatcher();

  constructor(private fb: FormBuilder) {
    this.createForm();
  }

  public onPasswordChange() {
    const password = this.passwordForm.get('password').value;
    this.passwordChange.emit(password);
    this.myForm.resetForm();
  }

  private createForm(): void {
    this.passwordForm = this.fb.group(
      {
        password: ['', Validators.required],
        passwordRepeat: ['', Validators.required],
      },
      { validator: matchPassword },
    );
  }
}
