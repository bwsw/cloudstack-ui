import { Component, Input } from '@angular/core';
import { NotificationService } from '../../../../shared/services/notification.service';
import { BaseTemplateModel } from '../../../shared/base/base-template.model';


@Component({
  selector: 'cs-download-url',
  templateUrl: 'download-url.component.html'
})
export class DownloadUrlComponent {
  @Input() public template: BaseTemplateModel;

  constructor(private notificationService: NotificationService) {}

  public onCopySuccess(): void {
    this.notificationService.message('CLIPBOARD.COPY_SUCCESS');
  }

  public onCopyFail(): void {
    this.notificationService.message('CLIPBOARD.COPY_FAIL');
  }
}
