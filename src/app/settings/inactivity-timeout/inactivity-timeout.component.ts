import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { AuthService } from '../../shared/services';
import { NgModel } from '@angular/forms';


@Component({
  selector: 'cs-inactivity-timeout',
  templateUrl: 'inactivity-timeout.component.html',
  styleUrls: ['inactivity-timeout.component.scss']
})
export class InactivityTimeoutComponent implements OnInit {
  @Input() public inactivityTimeout: number;
  @Output() public inactivityTimeoutChange: EventEmitter<number>;
  @ViewChild('inactivityTimeoutField') public inactivityField: NgModel;

  public tempInactivityTimeout: number;
  public maxInactivityTimeout = 300;

  constructor(private authService: AuthService) {
    this.inactivityTimeoutChange = new EventEmitter<number>();
  }

  public ngOnInit(): void {
    this.getInactivityTimeout();
  }

  public onBlur(): void {
    if (!this.inactivityField.valid) {
      this.tempInactivityTimeout = this.inactivityTimeout;
    }
  }

  public get changeButtonDisabled(): boolean {
    return this.inactivityTimeout === this.tempInactivityTimeout || !this.inactivityField.valid;
  }

  public getInactivityTimeout(): void {
    this.authService.getInactivityTimeout()
      .subscribe(timeout => {
        this.inactivityTimeout = timeout;
        this.tempInactivityTimeout = timeout;
      });
  }

  public changeInactivityTimeout(event: Event): void {
    event.preventDefault();
    this.authService.setInactivityTimeout(this.tempInactivityTimeout)
      .subscribe(() => this.inactivityTimeout = this.tempInactivityTimeout);
  }
}
