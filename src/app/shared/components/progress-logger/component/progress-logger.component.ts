import { Component, Input } from '@angular/core';
import { ProgressLoggerController } from '../progress-logger.service';


@Component({
  selector: 'cs-progress-logger',
  templateUrl: 'progress-logger.component.html',
  styleUrls: ['progress-logger.component.scss']
})
export class ProgressLoggerComponent {
  @Input() public controller: ProgressLoggerController;
  @Input() public showLast: number;
}
