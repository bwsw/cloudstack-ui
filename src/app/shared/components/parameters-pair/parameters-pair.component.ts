import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'cs-parameters-pair',
  templateUrl: 'parameters-pair.component.html',
  styleUrls: ['parameters-pair.component.scss']
})
export class ParametersPairComponent {
  @Input() public name: string;
  @Input() public value: string;
  @Input() public canBeEdit = false;
  @Input() public canBeCopy = false;
  @Output() public onButtonClicked = new EventEmitter();

  constructor(private notificationService: NotificationService) {
  }

  public onCopySuccess(): void {
    this.notificationService.message('CLIPBOARD.COPY_SUCCESS');
  }

  public onCopyFail(): void {
    this.notificationService.message('CLIPBOARD.COPY_FAIL');
  }
}
