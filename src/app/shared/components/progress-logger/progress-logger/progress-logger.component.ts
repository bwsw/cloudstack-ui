import { Component, Input } from '@angular/core';
import { ProgressLoggerController } from '../progress-logger.service';
import { ProgressLoggerMessage } from '../progress-logger-message/progress-logger-message';


@Component({
  selector: 'cs-progress-logger',
  templateUrl: 'progress-logger.component.html'
})
export class ProgressLoggerComponent {
  @Input() public controller: ProgressLoggerController;
}
