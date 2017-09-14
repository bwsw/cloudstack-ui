import { Component, Input } from '@angular/core';
import { ProgressLoggerMessage, ProgressLoggerMessageStatus } from './progress-logger-message';


@Component({
  selector: 'cs-progress-logger-message',
  templateUrl: 'progress-logger-message.component.html'
})
export class ProgressLoggerMessageComponent {
  @Input() public message: ProgressLoggerMessage;

  public get isInProgress(): boolean {
    return this.message.status === ProgressLoggerMessageStatus.InProgress;
  }

  public get isDone(): boolean {
    return this.message.status === ProgressLoggerMessageStatus.Done;
  }
}
