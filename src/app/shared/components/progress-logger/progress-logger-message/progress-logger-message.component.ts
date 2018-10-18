import { Component, Input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';

import { ProgressLoggerMessage, ProgressLoggerMessageStatus } from './progress-logger-message';

@Component({
  selector: 'cs-progress-logger-message',
  templateUrl: 'progress-logger-message.component.html',
  styleUrls: ['progress-logger-message.component.scss'],
})
export class ProgressLoggerMessageComponent {
  @Input()
  public message: ProgressLoggerMessage;

  constructor(private translateService: TranslateService) {}

  public get translatedMessage(): Observable<string> {
    if (typeof this.message.text === 'string') {
      return this.translateService.get(this.message.text);
    }
    return this.translateService.get(
      this.message.text.translationToken,
      this.message.text.interpolateParams,
    );
  }

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

  public get isErrorMessage(): boolean {
    return this.status.includes(ProgressLoggerMessageStatus.ErrorMessage);
  }

  private get status(): ProgressLoggerMessageStatus[] {
    return (this.message && this.message.status) || [];
  }
}
