import { Component, Input } from '@angular/core';
import { ProgressLoggerMessage, ProgressLoggerMessageStatus } from './progress-logger-message';


@Component({
  selector: 'cs-progress-logger-message',
  templateUrl: 'progress-logger-message.component.html',
  styleUrls: ['progress-logger-message.component.scss']
})
export class ProgressLoggerMessageComponent {
  @Input() public message: ProgressLoggerMessage;

  public get isHighlighted(): boolean {
    return this.status.includes(ProgressLoggerMessageStatus.Highlighted);
  }

  public get isInProgress(): boolean {
    return this.status.includes(ProgressLoggerMessageStatus.InProgress);
  }

  public get isDone(): boolean {
    return this.status.includes(ProgressLoggerMessageStatus.Done);
  }

  public get isError(): boolean {
    return this.status.includes(ProgressLoggerMessageStatus.Error);
  }

  private get status(): Array<ProgressLoggerMessageStatus> {
    if (Array.isArray(this.message.status)) {
      return this.message.status;
    } else {
      return [this.message.status];
    }
  }
}
