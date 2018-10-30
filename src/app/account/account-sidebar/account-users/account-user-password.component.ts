import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'cs-account-user-password-form',
  templateUrl: 'account-user-password.component.html',
})
export class AccountUserPasswordFormComponent {
  @Output()
  public changePassword = new EventEmitter<string>();

  public password: string;
  public confirmPassword: string;
  public hidePassword = true;
  public hideConfirmPassword = true;

  public onChangePassword() {
    if (this.password === this.confirmPassword) {
      this.changePassword.emit(this.password);
    }
  }
}
