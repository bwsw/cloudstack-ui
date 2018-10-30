import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'cs-session-timeout',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'session-timeout.component.html',
  styleUrls: ['./session-timeout.component.scss'],
})
export class SessionTimeoutComponent {
  @Input()
  sessionTimeout: number;
  @Output()
  updateSessionTimeout = new EventEmitter<number>();
  public readonly maxSessionTimeout = 300;
}
