import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { UserService } from '../../shared/services/user.service';
import { integerValidator } from '../../shared/directives/integer-validator';

@Component({
  selector: 'cs-inactivity-timeout',
  templateUrl: 'inactivity-timeout.component.html'
})
export class InactivityTimeoutComponent implements OnInit {
  public maxInactivityTimeout = 300;
  public validators = [
    Validators.required,
    Validators.min(0),
    Validators.max(this.maxInactivityTimeout),
    integerValidator()
  ];
  public inactivityTimeoutControl = new FormControl({ value: 0 }, this.validators);
  public validatorMessages = {
    'required': 'SETTINGS.SECURITY.INACTIVITY_IS_REQUIRED',
    'min': 'SETTINGS.SECURITY.INACTIVITY_BETWEEN',
    'max': 'SETTINGS.SECURITY.INACTIVITY_BETWEEN',
    'integerValidator': 'SETTINGS.SECURITY.INACTIVITY_INTEGER'
  };

  constructor(private userService: UserService) {
  }

  public ngOnInit(): void {
    this.getInactivityTimeout();
  }

  public getInactivityTimeout(): void {
    this.userService.getInactivityTimeout().subscribe(timeout => {
      this.inactivityTimeoutControl.setValue(timeout);
    });
  }

  public changeInactivityTimeout(event: Event): void {
    event.preventDefault();
    this.userService
      .setInactivityTimeout(this.inactivityTimeoutControl.value)
      .subscribe((value) => this.inactivityTimeoutControl.setValue(value));
  }
}
