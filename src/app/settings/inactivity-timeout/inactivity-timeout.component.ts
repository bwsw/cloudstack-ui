import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import { NgModel } from '@angular/forms';
import { UserService } from '../../shared/services/user.service';

@Component({
  selector: 'cs-inactivity-timeout',
  templateUrl: 'inactivity-timeout.component.html'
})
export class InactivityTimeoutComponent implements OnInit {
  @Input() public inactivityTimeout: number;
  @Output() public inactivityTimeoutChange: EventEmitter<number>;
  @ViewChild('inactivityTimeoutControl') public inactivityField: NgModel;

  public tempInactivityTimeout: number;
  public maxInactivityTimeout = 300;

  constructor(private userService: UserService) {
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
    return (
      this.inactivityTimeout === this.tempInactivityTimeout ||
      !this.inactivityField.valid
    );
  }

  public getInactivityTimeout(): void {
    this.userService.getInactivityTimeout().subscribe(timeout => {
      this.inactivityTimeout = timeout;
      this.tempInactivityTimeout = timeout;
    });
  }

  public changeInactivityTimeout(event: Event): void {
    event.preventDefault();
    this.userService
      .setInactivityTimeout(this.tempInactivityTimeout)
      .subscribe(() => (this.inactivityTimeout = this.tempInactivityTimeout));
  }
}
