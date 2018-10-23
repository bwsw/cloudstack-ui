import { Component, Input } from '@angular/core';
import { ProgressLoggerMessage } from '../progress-logger-message/progress-logger-message';

@Component({
  selector: 'cs-progress-logger',
  templateUrl: 'progress-logger.component.html',
})
export class ProgressLoggerComponent {
  @Input()
  public messages: ProgressLoggerMessage[];
}
