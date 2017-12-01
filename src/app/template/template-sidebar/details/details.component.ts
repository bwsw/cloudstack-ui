import { BaseTemplateModel } from '../../shared/base-template.model';
import { NotificationService } from '../../../shared/services/notification.service';
import { Input } from '@angular/core';


export abstract class BaseTemplateDetailsComponent {
  @Input() public entity: BaseTemplateModel;

  constructor(private notificationService: NotificationService) {
  }

  public get templateTypeTranslationToken(): string {
    const type = this.entity && (this.entity as any).type || '';
    const templateTypeTranslations = {
      'BUILTIN': 'Built-in',
      'USER': 'User'
    };

    return templateTypeTranslations[type];
  }

  public onCopySuccess(): void {
    this.notificationService.message('CLIPBOARD.COPY_SUCCESS');
  }

  public onCopyFail(): void {
    this.notificationService.message('CLIPBOARD.COPY_FAIL');
  }

}
